import * as THREE from 'three';

function create_shadows(light) {
    let res = 1024 * 4;

    light.castShadow = true;
    //Set up shadow properties for the light
    light.shadow.mapSize.width = res; // default
    light.shadow.mapSize.height = res; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 1000; // default
    light.shadow.camera.top = 60;
    light.shadow.camera.bottom = -60;
    light.shadow.camera.left = -60;
    light.shadow.camera.right = 60;

    return light;
}

function add_lights_to_scene(scene) {
    //______Light
    let sun = new THREE.DirectionalLight(0xffffff, 1, 100);
    sun = create_shadows(sun);
    sun.position.set(100, 200, 200);
    sun.intensity = 0.5;
    sun.castShadow = true;
    scene.add(sun);
    //let pointLightHelper = new THREE.PointLightHelper(sun, 1);
    //scene.add(pointLightHelper);

    let antisun = new THREE.DirectionalLight(0xffffff);
    antisun = create_shadows(antisun, 1024 * 2);
    antisun.intensity = 0.3;
    antisun.position.set(-100, 0, -100);
    scene.add(antisun);

    let antisun2 = new THREE.DirectionalLight(0xffffff);
    antisun2.intensity = 0.3;
    antisun2.position.set(100, 0, 100);
    scene.add(antisun2);

    let ambient = new THREE.AmbientLight(0xffffff);
    ambient.intensity = 0.3;
    scene.add(ambient);
}

export default add_lights_to_scene;
