import * as THREE from "three";

export function createScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x070a12, 12, 90);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x1b2a4a, 0.85));

    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(6, 10, 5);
    scene.add(dir);

    return scene;
}