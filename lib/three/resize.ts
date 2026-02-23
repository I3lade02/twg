import * as THREE from "three";

export function resizeRendererToDisplaySize(
    renderer: THREE.WebGLRenderer,
    camera: THREE.PerspectiveCamera
) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const needsResize = renderer.domElement.width !== Math.floor(width * (renderer.getPixelRatio() || 1)) ||
        renderer.domElement.height !== Math.floor(height * (renderer.getPixelRatio() || 1));

        if (needsResize) {
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
}