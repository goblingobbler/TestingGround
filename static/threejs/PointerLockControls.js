/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

	var scope = this;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 10;
	yawObject.add( pitchObject );

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

        if (!scope.enabled) { return }

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        if (event.type == 'touchmove'){
            rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
            rotateDelta.subVectors( rotateEnd, rotateStart );
            movementX = rotateDelta.x * 2;
            movementY = rotateDelta.y * 2;
        }

		yawObject.rotation.y += movementX * 0.002;
		pitchObject.rotation.x += movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

        rotateStart.set(rotateEnd.x, rotateEnd.y);
	};

	this.dispose = function() {

		document.removeEventListener( 'mousemove', onMouseMove, false );

	};

	document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'touchmove', onMouseMove, false );
    
    document.addEventListener('touchstart', function(){
        //controlsEnabled = true;
        controls.enabled = true;
        rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
    }, false);

    document.addEventListener('touchend', function(){
        //controlsEnabled = false;
        controls.enabled = false;
        rotateStart.set(0, 0);
    }, false);
    
    
	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.getPitchObject = function () {

		return pitchObject;

	};

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, - 1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		};

	}();

};
