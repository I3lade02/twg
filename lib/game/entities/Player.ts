// lib/game/entities/Player.ts
import * as THREE from "three";
import { GAME } from "@/lib/game/constants";

export class Player {
  mesh: THREE.Mesh;

  laneIndex = 1;
  yVel = 0;
  grounded = true;

  jumpStrength = 9.5;
  gravity = -22;
  laneLerp = 14;

  constructor() {
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1.2, 1),
      new THREE.MeshStandardMaterial({ color: 0x55ffaa })
    );
    this.mesh.position.set(0, 1, 0);
  }

  reset() {
    this.laneIndex = 1;
    this.yVel = 0;
    this.grounded = true;
    this.mesh.position.set(0, 1, 0);
    this.mesh.rotation.set(0, 0, 0);
  }

  moveLeft() {
    this.laneIndex = Math.max(0, this.laneIndex - 1);
  }

  moveRight() {
    this.laneIndex = Math.min(2, this.laneIndex + 1);
  }

  jump() {
    if (!this.grounded) return;
    this.yVel = this.jumpStrength;
    this.grounded = false;
  }

  update(dt: number) {
    const targetX = GAME.LANES[this.laneIndex];
    this.mesh.position.x = THREE.MathUtils.lerp(this.mesh.position.x, targetX, this.laneLerp * dt);

    this.yVel += this.gravity * dt;
    this.mesh.position.y += this.yVel * dt;

    if (this.mesh.position.y <= 1) {
      this.mesh.position.y = 1;
      this.yVel = 0;
      this.grounded = true;
    }
  }
}