import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function create_controlled_camera(renderer, width, height) {
    let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.x = -20;
    camera.position.y = 20;
    camera.position.z = 50;
    camera.updateProjectionMatrix();

    // CONTROLS
    let controls = new OrbitControls(camera, renderer.domElement);
    //CONTROLS.addEventListener( 'change', render ); // call this only in static SCENEs (i.e., if there is no animation loop)
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.enablePan = false;
    controls.minDistance = 1;
    controls.maxDistance = 1000;
    controls.maxPolarAngle = Math.PI / 2;
    controls.rotateSpeed = 0.5;

    controls.target.set(0, 0, 0);
    controls.update();

    console.log('Camera Position', camera.position);

    return [camera, controls];
}
