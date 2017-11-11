var boxes = [];


function createBox(size, position, material){
    var data = {
        position: position,
        size: size,
        material: material
    }

    box = Box(data);
    boxes.push(box);
}

Box = function (data){
    this.data = data

    if (typeof(data.size) != "undefined"){
        this.geometry = new THREE.BoxGeometry(data.size[0], data.size[1], data.size[2]);
    } else {
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
    }
    if (typeof(data.material) != "undefined"){
        this.material = new THREE.MeshPhongMaterial( {color: data.material} );
    } else {
        this.material = new THREE.MeshPhongMaterial( {color: 0x2194ce} );
    }

    this.mesh = new THREE.Mesh( geometry, material );

    scene.add(this.mesh);
    meshes.push(this.mesh);

    if (typeof(data.position) != "undefined"){
        this.mesh.position.set(data.position[0], data.position[1], data.position[2]);
    } else {
        this.mesh.position.set(0,0,0);
    }

}