
var meshes = [];
var objects = [];
var materials = [];
var skyboxCount = 0;
var materialArray = [];

function initSceneAndRenderer(ortho){
    scene = new THREE.Scene();

    light = new THREE.HemisphereLight( 0xffffff, 0x888888, 1.1 );
    light.position.set( 0.5, 1, 0.75 );
    light.groundColor.setRGB(.5, .5, .5);
    light.color.setRGB(1, 1, .95);
    scene.add( light );

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0xffffff );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( width, height );
    $(".viewer").prepend( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    if (typeof(ortho) == "undefined"){
        createCamera();
    } else {
        createOrthoCamera();
    }
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

function createScene(){
    scene = new THREE.Scene();
    lighting = false;

    ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambient);
}

function createRenderer(){
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));

    container.append(renderer.domElement);
}


function createSkybox(){
    textureLoader.load(imagePrefix + skyboxCount + imageSuffix, textureLoaded);
}

function textureLoaded( texture ) {
    // do something with the texture
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
     });

    materialArray.push(material);
    console.log(imagePrefix + skyboxCount);
    if (materialArray.length == 6){
        var skyGeometry = new THREE.BoxGeometry(2000, 2000, 2000);
        skyBox = new THREE.Mesh( skyGeometry, materialArray );
        scene.add( skyBox );
    } else {
        skyboxCount += 1;
        textureLoader.load(imagePrefix + skyboxCount + imageSuffix, textureLoaded);
    }
}



