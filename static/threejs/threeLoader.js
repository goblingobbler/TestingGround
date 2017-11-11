var meshes = [];
var objects = [];
var materials = [];

function initSceneAndRenderer(ortho){
    scene = new THREE.Scene();

    createSun(scene);
    createRenderer();

    window.addEventListener( 'resize', onWindowResize, false );

    if (typeof(ortho) == "undefined"){
        createCamera();
    } else {
        createOrthoCamera();
    }
}

function createSun(scene){
    light = new THREE.HemisphereLight( 0xffffff, 0x888888, 1.1 );
    light.position.set( 0.5, 1, 0.75 );
    light.groundColor.setRGB(.5, .5, .5);
    light.color.setRGB(1, 1, .95);
    scene.add( light );
}

function createRenderer(){
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0xffffff );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( width, height );
    $(".viewer").prepend( renderer.domElement );
}

function onWindowResize() {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

function createCamera(){
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 4000);
    controls = new THREE.PointerLockControls( camera );
    scene.add( controls.getObject());
}
function createOrthoCamera(){
    camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    controls = new THREE.OrbitControls( camera );
    controls.enableRotate = false;
    camera.zoom = 7;
    camera.updateProjectionMatrix();
}

var skyboxCount = 0;
var skyboxMaterials = [];
function createSkybox(){
    skyboxCount = 0;
    skyboxMaterials = [];
    textureLoader.load(imagePrefix + skyboxCount + imageSuffix, skyboxTextureLoaded);
}

function skyboxTextureLoaded( texture ) {
    // do something with the texture
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
     });

    skyboxMaterials.push(material);
    console.log(imagePrefix + skyboxCount);
    if (skyboxMaterials.length == 6){
        var skyGeometry = new THREE.BoxGeometry(2000, 2000, 2000);
        skyBox = new THREE.Mesh( skyGeometry, skyboxMaterials );
        scene.add( skyBox );
    } else {
        skyboxCount += 1;
        textureLoader.load(imagePrefix + skyboxCount + imageSuffix, skyboxTextureLoaded);
    }
}



