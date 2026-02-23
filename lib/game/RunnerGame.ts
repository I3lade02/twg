// lib/game/RunnerGame.ts
import * as THREE from "three";
import { createRenderer } from "@/lib/three/createRenderer";
import { createScene } from "@/lib/three/createScene";
import { createCamera } from "@/lib/three/createCamera";
import { resizeRendererToDisplaySize } from "@/lib/three/resize";
import { GAME } from "@/lib/game/constants";
import type { RunnerGameOptions } from "@/lib/game/types";

export class RunnerGame {
  private opts: RunnerGameOptions;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private rafId: number | null = null;
  private clock = new THREE.Clock();

  private score = 0;
  private speed = GAME.SPEED_START;

  // simple placeholder objects so we see something
  private debugCube: THREE.Mesh;

  constructor(opts: RunnerGameOptions) {
    this.opts = opts;

    this.scene = createScene();
    this.camera = createCamera();

    // Create and attach renderer to host
    this.renderer = createRenderer();
    this.opts.host.appendChild(this.renderer.domElement);

    // Add a visible object for now
    this.debugCube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x55ffaa })
    );
    this.debugCube.position.set(0, 1, 0);
    this.scene.add(this.debugCube);

    // Ground plane-ish block
    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(8, 1, 30),
      new THREE.MeshStandardMaterial({ color: 0x1b2a4a, roughness: 1 })
    );
    ground.position.set(0, 0, -5);
    this.scene.add(ground);

    // initial camera target
    this.camera.lookAt(0, 1, 0);

    // basic resize
    window.addEventListener("resize", this.onResize);
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
    // For now: reset simple state. Later we’ll reset entities and spawners.
    this.score = 0;
    this.speed = GAME.SPEED_START;
    this.opts.onScoreChange?.(this.score);
  }

  dispose() {
    this.stop();
    window.removeEventListener("resize", this.onResize);

    // Remove canvas
    this.renderer.domElement.remove();

    // Dispose three resources we created
    this.debugCube.geometry.dispose();
    (this.debugCube.material as THREE.Material).dispose();

    this.renderer.dispose();
  }

  private onResize = () => {
    resizeRendererToDisplaySize(this.renderer, this.camera);
  };

  private loop = () => {
    this.rafId = requestAnimationFrame(this.loop);

    const dt = Math.min(this.clock.getDelta(), 0.033);

    // Update placeholder “game”
    this.speed += dt * 0.15;
    this.score += Math.floor(this.speed * dt);
    this.opts.onScoreChange?.(this.score);

    // Animate the cube a bit so we know it’s alive
    this.debugCube.rotation.y += dt * 1.2;
    this.debugCube.position.x = Math.sin(performance.now() / 600) * 1.2;

    // Camera gentle follow
    const target = new THREE.Vector3(this.debugCube.position.x, 5.5, 10);
    this.camera.position.lerp(target, 2.5 * dt);
    this.camera.lookAt(this.debugCube.position.x, 1.2, 0);

    resizeRendererToDisplaySize(this.renderer, this.camera);
    this.renderer.render(this.scene, this.camera);
  };
}