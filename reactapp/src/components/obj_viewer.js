import React, { Component } from 'react';

import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

import {
    ajax_wrapper,
    create_controlled_camera,
    add_lights_to_scene,
    add_plane_to_scene,
} from 'functions';

export default class OBJViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            first_part_loaded: false,

            renderer: null,
            scene: null,
            camera: null,
            gear: null,
        };

        this.scene = React.createRef();
    }

    componentDidMount() {
        if (this.state.renderer == null) {
            this.create_scene();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.part_text != prevProps.part_text) {
            this.load_part();
        }
    }

    create_scene = () => {
        if (this.scene.current && this.state.renderer == null) {
            if (this.scene.current.childElementCount > 0) {
                return null;
            }

            let width = this.scene.current.offsetWidth;
            let height = window.innerHeight;

            // === THREE.JS CODE START ===
            let scene = new THREE.Scene();
            scene.background = new THREE.Color(0xaaaaaa);

            let renderer = new THREE.WebGLRenderer();
            renderer.setSize(width, height);
            renderer.shadowMap.enabled = true;
            this.scene.current.appendChild(renderer.domElement);

            let [camera, controls] = create_controlled_camera(
                renderer,
                width,
                height,
            );

            add_lights_to_scene(scene);
            add_plane_to_scene(scene);

            this.setState(
                {
                    loaded: true,
                    renderer: renderer,
                    scene: scene,
                    camera: camera,
                    controls: controls,
                },
                function () {
                    this.animate();
                    this.load_part();
                }.bind(this),
            );
        } else {
            setTimeout(this.create_scene, 100);
        }
    };

    animate = () => {
        requestAnimationFrame(this.animate);
        this.state.controls.update();

        if (this.state.part) {
            this.state.part.rotation.z += 0.001;
        }

        this.state.renderer.render(this.state.scene, this.state.camera);
    };

    load_part = () => {
        if (!this.state.loaded || this.props.part_text == '') {
            return null;
        }

        if (this.state.part) {
            this.state.scene.remove(this.state.part);
        }

        let loader = new STLLoader();
        let geometry = loader.parse(this.props.part_text);

        const material = new THREE.MeshStandardMaterial({
            roughness: 0.2,
            color: new THREE.Color(0xffffff),
        });

        let box_center = new THREE.Vector3();
        let box_size = new THREE.Vector3();

        let gear = new THREE.Mesh(geometry, material);
        geometry.computeVertexNormals();
        gear.castShadow = true;

        const box3 = new THREE.Box3().setFromObject(gear);
        box3.getCenter(box_center);
        box3.getSize(box_size);
        console.log('Gear Center', box_center, 'Gear Size', box_size);

        gear.position.set(
            -box_center.x,
            -box_center.y + box_size.y / 2 + 5,
            -box_center.z,
        );

        this.state.scene.add(gear);

        this.state.controls.target.set(
            0,
            -box_center.y + box_size.y / 2 + 5,
            0,
        );

        this.state.camera.position.set(
            (-1 * box_size.x) / 2,
            box_size.y / 1.5 + 5,
            box_size.x,
        );

        console.log('Camera Position', this.state.camera.position);

        this.setState({
            part: gear,
            first_part_loaded: true,
        });
    };

    render() {
        return <div ref={this.scene}></div>;
    }
}
