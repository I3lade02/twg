import * as THREE from "three";
import { GAME } from "../constants";

export class Coin {
    mesh: THREE.Mesh;
    collected = false;

    constructor() {
        //simply cylinder coin
        this.mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(GAME.COIN_RADIUS, GAME.COIN_RADIUS, 0.12, 18),
            new THREE.MeshStandardMaterial({ color: 0xffd34d, metalness: 0.7, roughness: 0.25 })
        );
        this.mesh.rotation.x = Math.PI / 2; //face (camera-ish)
        this.mesh.position.set(0, GAME.COIN_Y, 0);
    }

    update(dt: number) {
        //tiny spin for juiciness
        this.mesh.rotation.z += dt * 4.0;
    }

    dispose() {
        this.mesh.geometry.dispose();
        (this.mesh.material as THREE.Material).dispose();
    }
}