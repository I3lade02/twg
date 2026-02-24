import * as THREE from "three";

export class Collision {
    private playerBox = new THREE.Box3();
    private obstacleBox = new THREE.Box3();

    intersects(playerObj: THREE.Object3D, obstacleObj: THREE.Object3D) {
        this.playerBox.setFromObject(playerObj);
        this.obstacleBox.setFromObject(obstacleObj);
        return this.playerBox.intersectsBox(this.obstacleBox);
    }
}
