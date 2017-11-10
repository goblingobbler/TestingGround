
var POSITIONING = false;
var UPLOADING = false;
var VIEWING = false;
var activeSphereIndex = 0;
var lastSphereIndex = 0;
var photoCount = 0;

function toggleCameraView(){
    var pos = controls.getObject().position;
    if (pos.y == 10){
        pos.y = 40;
        controls.getPitchObject().rotation.set(-1.5, 0, 0);
    } else {
        controls.getPitchObject().rotation.set(0, 0, 0);
        moveCameraToSphere(lastSphereIndex);
    }
}

function moveCameraToSphere(index){
    var activeSphere = objects[index];
    var pos = activeSphere.position;

    activeSphere.visible = true;
    controls.getObject().position.set(pos.x, pos.y, pos.z);
}

function displayPhotos(){
    var fileNames = [];
    for (var i = 0; i < TOURDATA['photos'].length; i++){
        var photo =  '/static/s3Images/' + HOUSEID + "/" + TOURDATA['photos'][i];
        fileNames.push(photo);
    }

    var image = $(".photoList .secretImage").clone();
    image.removeClass("secretImage");
    image.show();
    image.find("img").attr("src", fileNames[photoCount]);
    image.find("img").attr("num", photoCount);
    $(".photoList").append(image);

    textureLoader.load(fileNames[photoCount], createPhotoSphere);
}

function createPhotoSphere(texture){
    //Flip
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = - 1;

    var src = texture.image.src.split("/")
    var name = src[src.length - 1];

    var sphere = new THREE.SphereGeometry(4, 50, 50);
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
    });
    var sphereMesh = new THREE.Mesh( sphere, material );

    sphereMesh.name = name;


    scene.add( sphereMesh );
    objects.push(sphereMesh);
    meshes.push(sphereMesh);

    setSpherePosition(sphereMesh);
    if (objects.length != 1){
        sphereMesh.visible = false;
    }

    if (photoCount < TOURDATA['rotations'].length){
        var yRot = TOURDATA['rotations'][photoCount];
        sphereMesh.rotation.y = yRot;
    }

    if (UPLOADING){
        if (inputPhotoCount + 1 < files.length){
            photoCount += 1;
            inputPhotoCount += 1;
            fr.readAsDataURL(files[inputPhotoCount]);
        } else if (objects.length > 0){
            showNotif($(".notifs"), "All photos uploaded.  Start positioning.", "success");
        }
    } else {
        if (photoCount + 1 < TOURDATA['photos'].length){
            photoCount += 1;
            displayPhotos();
        } else if (objects.length > 0){
            showNotif($(".notifs"), "Saved data loaded. Start positioning or load more photos.", "success");
            if (VIEWING){
                $(".blocker").remove();
                createPhotoMarkers();
            }
        }
    }
}

function setSpherePosition(object, pos, moveCamera){
    if (typeof(pos) != "undefined"){
        object.position.set(pos.x, pos.y, pos.z);
    } else if (photoCount < TOURDATA['positions'].length){
        var newPos = TOURDATA['positions'][photoCount];
        object.position.set(newPos[0], newPos[1], newPos[2]);
    } else if (photoCount == 0){
        object.position.set(0, 10, 0);
    } else {
        object.position.set(0, -100, 0);
    }

    if (typeof(moveCamera) != "undefined"){
        controls.getObject().position.set(pos.x, pos.y, pos.z);
    }
}

function createPhotoMarkers(){
    for (var i = 0; i < objects.length; i++){
        var count = 0;
        var minDistance = 1000;
        var minIndex = -1;
        var exclusions = TOURDATA['exclusions'][i];

        for (var j = 0; j < objects.length; j++){
            if (i != j){
                var name = objects[j].name;
                var origin = objects[i].position.clone();
                var dest = objects[j].position.clone();

                var dist = origin.distanceTo(dest);
                var ydiff = Math.abs(dest.y - origin.y);

                dest.y -= 10;
                dest.sub(origin);
                dest.normalize();
                dest.multiplyScalar(4);
                dest.add(origin);

                var current = objects[i].position.clone();
                var photoSphere = objects[j];
                if (dist < 40 && ydiff < 15){
                    if (exclusions.indexOf(name) == -1){
                        count += 1;
                        createMarker(photoSphere, dest, current, dist);
                    }
                }
                if (dist < minDistance){
                    minDistance = dist;
                    minIndex = j;
                }
            }
        }
        if (count == 0){
            var origin = objects[i].position.clone();
            var dest = objects[minIndex].position.clone();

            var dist = origin.distanceTo(dest);

            dest.y -= 10;
            dest.sub(origin);
            dest.normalize();
            dest.multiplyScalar(4);
            dest.add(origin);

            var current = objects[i].position.clone();
            var photoSphere = objects[minIndex];
            createMarker(photoSphere, dest, current, dist);
        }
    }
}

var markers = [];
var toruses = [];
function createMarker(photoSphere, pos, current, distance){
    var scale = 400 / (distance * distance);
    if (scale > 1){ scale = 1;}
    if (scale < .05){ scale = .05;}

    var vec = current.sub(pos.clone());
    var forward = new THREE.Vector3(0, 0, 1);
    var up = new THREE.Vector3(0, 1, 0);

    var geometry = new THREE.SphereGeometry(.25, 15, 15);
    var material = new THREE.MeshPhongMaterial( {color: 0x2194ce, transparent: true, opacity: 0.5} );
    var sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );

    sphere.position.set(pos.x, pos.y, pos.z);
    sphere.scale.set(scale, scale, scale);
    setToAxis(sphere, forward, up);
    sphere.visible = true;

    sphere.photoSphere = photoSphere;
    markers.push(sphere);
    meshes.push(sphere);

    /*
    var geometry2 = new THREE.TorusGeometry(.2, .04, 10, 50);
    var material2 = new THREE.MeshPhongMaterial( {color: 0x85f0fb} );
    var torus = new THREE.Mesh( geometry2, material2 );
    scene.add( torus );
    torus.position.set(pos.x, pos.y, pos.z);
    torus.scale.set(scale, scale, scale);
    setToAxis(torus, forward, up);
    toruses.push(torus);
    */
}


function teleportThroughMarker(intersect){
    var ids = [];
    for (var i = 0; i < markers.length; i++){
        ids.push(markers[i].uuid);
    }
    var index = ids.indexOf(intersect[0].object.uuid);
    if (index > -1){
        var photoIndex = objects.indexOf(markers[index].photoSphere);
        moveCameraToSphere(photoIndex);
    }
}

function excludeMarker(intersect){
    var ids = [];
    for (var i = 0; i < markers.length; i++){
        ids.push(markers[i].uuid);
    }
    var index = ids.indexOf(intersect[0].object.uuid);
    if (index > -1){
        var name = markers[index].photoSphere.name;
        var exclusions = TOURDATA["exclusions"][lastSphereIndex];

        if (exclusions.indexOf(name) == -1){
            exclusions.push(name);
            scene.remove(markers[index]);
        }
    }
}