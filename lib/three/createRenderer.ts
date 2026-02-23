import * as THREE from "three";

export function createRenderer(canvas?: HTMLCanvasElement) {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        canvas,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    return renderer;
}