import React, { Component } from 'react';

import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

import {
    ajax_wrapper,
    create_controlled_camera,
    add_lights_to_scene,
    add_plane_to_scene,
} from 'functions';
import { Button } from 'library';

export default class OBJViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,

            renderer: null,
            scene: null,
            camera: null,
            gear: null,

            wireframe: false,
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
            if (this.scene.current.querySelectorAll('canvas').length > 0) {
                return null;
            }

            let parent_postition = this.scene.current.getBoundingClientRect();

            let width = this.scene.current.offsetWidth;
            let height = window.innerHeight - parent_postition.top;

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

    load_part = () => {
        if (this.state.part) {
            this.state.scene.remove(this.state.part);
        }

        if (!this.state.loaded || this.props.part_text == '') {
            return null;
        }

        let loader = new STLLoader();
        let geometry = loader.parse(this.props.part_text);

        let part = null;
        if (this.state.wireframe) {
            let wireframe = new THREE.WireframeGeometry(geometry);
            part = new THREE.LineSegments(wireframe);
        } else {
            let material = new THREE.MeshStandardMaterial({
                roughness: 0.4,
                color: new THREE.Color(0xffffff),
            });
            part = new THREE.Mesh(geometry, material);
        }

        geometry.computeVertexNormals();
        part.castShadow = true;

        console.log('Camera Position', this.state.camera.position);

        this.setState(
            {
                part: part,
            },
            function () {
                this.position_mesh(this.state.part, true);
                this.state.scene.add(this.state.part);
            }.bind(this),
        );
    };

    position_mesh = (mesh, focus_camera) => {
        let box_center = new THREE.Vector3();
        let box_size = new THREE.Vector3();

        const box3 = new THREE.Box3().setFromObject(mesh);
        box3.getCenter(box_center);
        box3.getSize(box_size);
        console.log('Mesh Center', box_center, 'Mesh Size', box_size);

        mesh.position.set(
            -box_center.x,
            -box_center.y + box_size.y / 2 + 5,
            -box_center.z,
        );

        if (focus_camera === true) {
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
        }
    };

    toggle_wireframe = () => {
        this.setState({ wireframe: !this.state.wireframe }, this.load_part);
    };

    animate = () => {
        requestAnimationFrame(this.animate);
        this.state.controls.update();

        if (this.state.part) {
            this.state.part.rotation.z += 0.001;
        }

        this.state.renderer.render(this.state.scene, this.state.camera);
    };

    render() {
        return (
            <div ref={this.scene} className="threejs">
                <div className="threejs-controls">
                    <Button type="primary" onClick={this.toggle_wireframe}>
                        Wireframe
                    </Button>
                </div>
            </div>
        );
    }
}
