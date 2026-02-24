import * as THREE from "three";
import { GAME } from "@/lib/game/constants";

export class Obstacle {
    mesh: THREE.Mesh;

    constructor() {
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(GAME.OBSTACLE_SIZE, GAME.OBSTACLE_SIZE, GAME.OBSTACLE_SIZE),
            new THREE.MeshStandardMaterial({ color: 0xff5577 })
        );
        this.mesh.position.set(0, 1, 0);
    }

    dispose() {
        this.mesh.geometry.dispose();
        (this.mesh.material as THREE.Material).dispose();
    }
}