import React, { Component } from 'react';

import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { ajax_wrapper } from 'functions';

export default class OBJViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderer: null,
            scene: null,
            camera: null,
            gear: null,
            input_text: '',
        };

        this.scene = React.createRef();
    }

    componentDidMount() {
        if (this.state.renderer == null) {
            this.create_scene();
        }
    }

    create_scene = () => {
        if (this.scene.current && this.state.renderer == null) {
            if (this.scene.current.childElementCount > 0) {
                return null;
            }

            // === THREE.JS CODE START ===
            let scene = new THREE.Scene();
            let camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000,
            );
            let renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);

            this.scene.current.appendChild(renderer.domElement);

            // CONTROLS
            let controls = new OrbitControls(camera, renderer.domElement);
            //CONTROLS.addEventListener( 'change', render ); // call this only in static SCENEs (i.e., if there is no animation loop)
            controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
            controls.dampingFactor = 0.25;
            controls.screenSpacePanning = false;
            controls.enablePan = false;
            controls.minDistance = 0;
            controls.maxDistance = 100;
            controls.maxPolarAngle = Math.PI / 2;
            controls.rotateSpeed = 0.5;
            controls.target.set(0, 0, 0);

            camera.position.z = 50;

            ajax_wrapper('GET', '/api/gears/create/', {}, (value) =>
                this.setState({ input_text: value }, this.load_gear),
            );

            this.setState(
                {
                    controls: controls,
                    renderer: renderer,
                    scene: scene,
                    camera: camera,
                },
                this.animate,
            );
        } else {
            setTimeout(this.create_scene, 100);
        }
    };

    animate = () => {
        requestAnimationFrame(this.animate);

        if (this.state.gear) {
            this.state.gear.rotation.z += 0.001;
        }

        this.state.renderer.render(this.state.scene, this.state.camera);
    };

    load_gear = () => {
        let loader = new STLLoader();

        let geometry = loader.parse(this.state.input_text);
        let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        let gear = new THREE.Mesh(geometry, material);
        this.state.scene.add(gear);
        this.setState({ gear: gear });
    };

    render() {
        return <div ref={this.scene}></div>;
    }
}
