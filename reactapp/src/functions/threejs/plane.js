import * as THREE from 'three';

export default function add_plane_to_scene(scene) {
    // _____Plane______
    const planeGeometry = new THREE.CircleGeometry(250, 92);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0x666666,
        side: THREE.DoubleSide,
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = 0;
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);
}
