// lib/game/RunnerGame.ts
import * as THREE from "three";
import { createRenderer } from "@/lib/three/createRenderer";
import { createScene } from "@/lib/three/createScene";
import { createCamera } from "@/lib/three/createCamera";
import { resizeRendererToDisplaySize } from "@/lib/three/resize";
import { GAME } from "@/lib/game/constants";
import type { RunnerGameOptions } from "@/lib/game/types";
import { KeyboardInput } from "@/lib/game/input/KeyboardInput";
import { Player } from "@/lib/game/entities/Player";
import { Spawner } from "@/lib/game/systems/Spawner";
import { Collision } from "@/lib/game/systems/Collision";
import { Pickups } from "@/lib/game/systems/Pickups";

export class RunnerGame {
  private opts: RunnerGameOptions;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private rafId: number | null = null;
  private clock = new THREE.Clock();

  private score = 0;
  private speed = GAME.SPEED_START;
  private gameOver = false;

  private input: KeyboardInput;
  private player: Player;

  private spawner: Spawner;
  private collision: Collision;
  private pickups: Pickups;

  // HUD state
  private coins = 0;
  private multiplier = 1;

  constructor(opts: RunnerGameOptions) {
    this.opts = opts;

    this.scene = createScene();
    this.camera = createCamera();

    this.renderer = createRenderer();
    this.opts.host.appendChild(this.renderer.domElement);

    this.input = new KeyboardInput();
    this.player = new Player();
    this.scene.add(this.player.mesh);

    this.spawner = new Spawner(this.scene);
    this.spawner.init();

    this.collision = new Collision();
    this.pickups = new Pickups();

    this.camera.lookAt(0, 1, 0);

    window.addEventListener("resize", this.onResize);
  }

  getHUDState() {
    return { coins: this.coins, multiplier: this.multiplier };
  }

  start() {
    if (this.rafId !== null) return;
    this.clock.start();
    this.loop();
  }

  stop() {
    if (this.rafId === null) return;
    cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  restart() {
    this.score = 0;
    this.speed = GAME.SPEED_START;
    this.gameOver = false;

    this.player.reset();
    this.spawner.init();

    this.pickups.reset();
    this.coins = 0;
    this.multiplier = 1;

    this.opts.onScoreChange?.(this.score);
  }

  dispose() {
    this.stop();
    window.removeEventListener("resize", this.onResize);

    this.input.dispose();

    this.scene.remove(this.player.mesh);
    this.player.mesh.geometry.dispose();
    (this.player.mesh.material as THREE.Material).dispose();

    this.spawner.dispose();

    this.renderer.domElement.remove();
    this.renderer.dispose();
  }

  private onResize = () => {
    resizeRendererToDisplaySize(this.renderer, this.camera);
  };

  private crash() {
    if (this.gameOver) return;
    this.gameOver = true;
    this.opts.onGameOver?.();
  }

  private loop = () => {
    this.rafId = requestAnimationFrame(this.loop);

    const dt = Math.min(this.clock.getDelta(), 0.033);
    const keys = this.input.snapshot();

    if (keys.restartPressed) this.restart();

    if (this.gameOver) {
      resizeRendererToDisplaySize(this.renderer, this.camera);
      this.renderer.render(this.scene, this.camera);
      return;
    }

    // Input → player intentions
    if (keys.leftPressed) this.player.moveLeft();
    if (keys.rightPressed) this.player.moveRight();
    if (keys.jumpPressed) this.player.jump();

    // Speed ramp + distance step
    this.speed += dt * GAME.SPEED_RAMP;
    const dz = this.speed * dt;

    // Update entities
    this.player.update(dt);

    // Move world toward camera + recycle chunks
    this.spawner.update(dz);

    // Pickups update + coin spin + collection
    this.pickups.update(dt);

    const allCoins = this.spawner.chunks.flatMap((c) => c.coins);
    for (const c of allCoins) c.update(dt);

    this.pickups.collectFrom(this.player.mesh, allCoins);

    const p = this.pickups.getState();
    this.coins = p.coins;
    this.multiplier = p.multiplier;

    // Score gain affected by multiplier
    const baseGain = Math.floor(dz * 10);
    this.score += this.pickups.scoreGain(baseGain);
    this.opts.onScoreChange?.(this.score);

    // Collision with obstacles
    const obs = this.spawner.getAllObstacles();
    for (const o of obs) {
      if (this.collision.intersects(this.player.mesh, o.mesh)) {
        this.crash();
        break;
      }
    }

    // Camera follow
    const camTarget = new THREE.Vector3(this.player.mesh.position.x, 5.5, 10);
    this.camera.position.lerp(camTarget, 3 * dt);
    this.camera.lookAt(this.player.mesh.position.x, 1.2, 0);

    resizeRendererToDisplaySize(this.renderer, this.camera);
    this.renderer.render(this.scene, this.camera);
  };
}