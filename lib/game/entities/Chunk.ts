// lib/game/entities/Chunk.ts
import * as THREE from "three";
import { GAME } from "@/lib/game/constants";
import { Obstacle } from "@/lib/game/entities/Obstacle";
import { Coin } from "@/lib/game/entities/Coin";

export class Chunk {
  ground: THREE.Mesh;
  obstacles: Obstacle[] = [];
  coins: Coin[] = [];

  constructor(groundMat: THREE.Material) {
    this.ground = new THREE.Mesh(
      new THREE.BoxGeometry(GAME.CHUNK_WIDTH, 1, GAME.CHUNK_LEN),
      groundMat
    );
    this.ground.position.set(0, 0, 0);
  }

  setZ(z: number) {
    this.ground.position.z = z;
  }

  getZ() {
    return this.ground.position.z;
  }

  move(dz: number) {
    this.ground.position.z += dz;
    for (const o of this.obstacles) o.mesh.position.z += dz;
    for (const c of this.coins) c.mesh.position.z += dz;
  }

  clearObstacles(scene: THREE.Scene) {
    for (const o of this.obstacles) {
      scene.remove(o.mesh);
      o.dispose();
    }
    this.obstacles = [];
  }

  spawnObstacles(scene: THREE.Scene, lanesToBlock: number[]) {
    for (const lane of lanesToBlock) {
      const obs = new Obstacle();
      const laneX = GAME.LANES[lane];
      const zOffset = Math.random() * GAME.CHUNK_LEN - GAME.CHUNK_LEN / 2;

      obs.mesh.position.set(laneX, 1, this.ground.position.z + zOffset);
      scene.add(obs.mesh);
      this.obstacles.push(obs);
    }
  }

  clearCoins(scene: THREE.Scene) {
    for (const c of this.coins) {
      scene.remove(c.mesh);
      c.dispose();
    }
    this.coins = [];
  }

  spawnCoins(scene: THREE.Scene, laneIndex: number, count: number) {
    for (let i = 0; i < count; i++) {
      const coin = new Coin();
      const laneX = GAME.LANES[laneIndex];

      const zOffset = -GAME.CHUNK_LEN / 2 + 2 + i * GAME.COIN_LINE_GAP_Z;

      coin.mesh.position.set(laneX, GAME.COIN_Y, this.ground.position.z + zOffset);
      scene.add(coin.mesh);
      this.coins.push(coin);
    }
  }

  dispose() {
    this.ground.geometry.dispose();
    (this.ground.material as THREE.Material).dispose();
  }
}