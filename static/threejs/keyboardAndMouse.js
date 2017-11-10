var pointerSphere;

var rotateStart = new THREE.Vector2();
var rotateEnd = new THREE.Vector2();
var rotateDelta = new THREE.Vector2();
var TELEPORT = true;

function controlsLive(teleport, width, height){
    initKeyboard();
    setUpMouse();

    createPointerSphere(width, height);

    if (typeof(teleport) != "undefined"){
        TELEPORT = teleport;
    } else {
        TELEPORT = true ;
    }

    controlsEnabled = true;
}

var isShift= false;
function initKeyboard(){
    var onKeyDown = function ( event ) {

        console.log(event.keyCode);
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true; break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if ( canJump === true ) //velocity.y += 100;
                canJump = false;
                break;

            case 16: //shift
                isShift = true;
                break;
        }
    };

    var onKeyUp = function ( event ) {
        switch( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

            case 16: //shift
                isShift = false;
                break;
        }
    };

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
}

function setUpMouse(){
    var element = document.body;

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    element.addEventListener("mousedown", function(event){
        if (mouse.x > -1 && mouse.y > -1 && mouse.x < 1 && mouse.y < 1){
            lastMouse = mouse.clone();
            //controlsEnabled = true;
            controls.enabled = true;
        }
    });

    element.addEventListener("mouseup", function(event){
        //controlsEnabled = false;
        controls.enabled = false;
        var xDiff = Math.abs(lastMouse.x - mouse.x);
        var yDiff = Math.abs(lastMouse.y - mouse.y);

        if (xDiff < .05 && yDiff < .05){
            mouseCaster.setFromCamera(mouse.clone(), camera);

            if (TELEPORT){
                var teleport = mouseCaster.intersectObjects( meshes );
                if (teleport.length > 0 && teleport[0].face.normal.z < .9){
                    controls.getObject().position.set(teleport[0].point.x, controls.getObject().position.y, teleport[0].point.z);
                }
            }
        }
    });

    element.addEventListener("click", function(event){

    });
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    var startingPos = $('.viewer').position();

    mouse.x = ((event.clientX - startingPos.left) / width) * 2 - 1;
    mouse.y = -((event.clientY - startingPos.top) / height) * 2 + 1;

    mouseCaster.setFromCamera(mouse.clone(), camera);

    if (TELEPORT){
        var teleport = mouseCaster.intersectObjects( meshes );
        if (teleport.length > 0){
            if (teleport[0].face.normal.y > .9 && teleport[0].face.normal.z < .1 && teleport[0].face.normal.x < .1){
                pointerSphere.position.set(teleport[0].point.x, teleport[0].point.y, teleport[0].point.z);
            }
        }
    }
}

function createPointerSphere(width, height){
    if (typeof(width) == "undefined"){ width = 2;}
    if (typeof(height) == "undefined"){ height = 1;}

    var geometry = new THREE.CylinderGeometry( width, width, height, 20);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var sphere = new THREE.Mesh( geometry, material );

    scene.add( sphere );

    sphere.position.set(8,0,-20);

    pointerSphere = sphere;
}

function movePointerSphere(angle){
    var intersect = mouseCaster.intersectObjects( meshes );
    if (intersect.length > 0){
        pointerSphere.position.set(intersect[0].point.x, intersect[0].point.y, intersect[0].point.z);

        var vec = intersect[0].point.clone().sub(controls.getObject().position);
        var up = new THREE.Vector3( 0, 1, 0 );
        setToAxis(pointerSphere, up, vec);
    }
}

function setToAxis(object, axis, vector){
    object.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
}

