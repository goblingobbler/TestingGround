import React, { Component } from 'react';
import { HEADER_HEIGHT } from 'constants';

import { Button, Form } from 'library';
import { Header, OBJViewer, HelixForm } from 'components';
import { ajax_wrapper } from 'functions';

const VASE_EXAMPLES = {
    helix: [
        {
            radial_distance: 0,
            polar_angle: 0,
            steps: 50,
            height: 20,
            rotation_about_center: 0,
            reverse: false,
            circle_radius: 4.5,
            circle_points: 8,
            ossilation: 1.5,
            ossilation_steps: 48,
            ossilation_start: 1.57,
            rotation_about_self: 6.28,
            rotation_reverse: false,
        },
        {
            radial_distance: 4.2,
            polar_angle: 0,
            steps: 50,
            height: 20,
            rotation_about_center: 3.14159,
            reverse: false,
            circle_radius: 2,
            circle_points: 8,
            rotation_about_self: 0,
            rotation_reverse: false,
        },
        {
            radial_distance: 4.2,
            polar_angle: 3.14159,
            steps: 50,
            height: 20,
            rotation_about_center: 3.14159,
            reverse: false,
            circle_radius: 2,
            circle_points: 8,
            rotation_about_self: 0,
            rotation_reverse: false,
        },
        {
            radial_distance: 4.2,
            polar_angle: -1.57,
            steps: 50,
            height: 20,
            rotation_about_center: 3.14159,
            reverse: false,
            circle_radius: 2,
            circle_points: 8,
            rotation_about_self: 0,
            rotation_reverse: false,
        },
        {
            radial_distance: 4.2,
            polar_angle: 1.57,
            steps: 50,
            height: 20,
            rotation_about_center: 3.14159,
            reverse: false,
            circle_radius: 2,
            circle_points: 8,
            rotation_about_self: 0,
            rotation_reverse: false,
        },
    ],
    braided: [
        {
            radial_distance: 0,
            polar_angle: 0,
            steps: 48,
            height: 19.2,
            rotation_about_center: 3.14159,
            reverse: false,
            circle_radius: 5,
            circle_points: 24,
            rotation_reverse: false,
        },
    ],
    bulb: [
        {
            radial_distance: 0,
            polar_angle: 0,
            steps: 50,
            height: 20,
            rotation_about_center: 0,
            reverse: false,
            circle_radius: 4,
            circle_points: 24,
            ossilation: 2,
            ossilation_steps: 48,
            ossilation_start: 1.57,
            rotation_reverse: false,
        },
    ],
};

const BRAIDED_CHILDREN = [
    {
        radial_distance: 5,
        polar_angle: 0,
        steps: 48,
        height: 19.2,
        rotation_about_center: 3.14159,
        reverse: false,
        circle_radius: 2,
        circle_points: 24,
        rotation_reverse: false,
    },
    {
        radial_distance: 5,
        polar_angle: 0,
        steps: 48,
        height: 19.2,
        rotation_about_center: 3.14159,
        reverse: true,
        circle_radius: 2,
        circle_points: 24,
        rotation_reverse: false,
    },
];

const BULB_CHILDREN = [
    {
        radial_distance: 5,
        polar_angle: 0,
        steps: 48,
        height: 19.2,
        rotation_about_center: 3.14159,
        reverse: false,
        circle_radius: 2,
        circle_points: 24,
        ossilation: 2,
        ossilation_steps: 48,
        ossilation_start: 4.712,
        rotation_reverse: false,
    },
];

export default class Vases extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teeth: 10,
            module: 1,

            type: 'helix',
            part_text: '',
            file: null,

            helix_list: [{}],
        };
    }

    componentDidMount() {
        this.get_vase();
    }

    get_vase = () => {
        ajax_wrapper(
            'POST',
            '/api/objects/create_vase/',
            { helix_list: this.state.helix_list },
            function (value) {
                let file = new File([value], 'vase.stl');
                this.setState({ part_text: value, file: file });
            }.bind(this),
        );
    };

    submit = () => {
        this.setState(
            {
                part_text: '',
            },
            function () {
                this.get_vase();
            },
        );
    };

    update = (name, state) => {
        let index = parseInt(name);

        let new_helix = Object.assign(this.state.helix_list[index], state);
        this.state.helix_list[index] = new_helix;

        this.setState({
            helix_list: this.state.helix_list,
        });
    };

    render() {
        let helix_forms = [];
        for (let item of this.state.helix_list) {
            let index = this.state.helix_list.indexOf(item);
            helix_forms.push(
                <div className="simple-card">
                    <HelixForm index={index} data={item} update={this.update} />
                </div>,
            );
        }

        return (
            <div style={{ overflow: 'hidden', marginTop: HEADER_HEIGHT }}>
                <Header />
                <div className="row" style={{ margin: '0px' }}>
                    <div className="col-3" style={{ padding: '0px' }}>
                        <div className="simple-card-container">
                            <div className="simple-card">
                                <h3>Vase Generator</h3>
                            </div>
                            <div className="simple-card">
                                <Button
                                    type={'primary'}
                                    style={{
                                        display: 'block',
                                        marginBottom: '5px',
                                    }}
                                    onClick={() =>
                                        this.setState(
                                            {
                                                helix_list:
                                                    VASE_EXAMPLES['helix'],
                                                part_text: '',
                                            },
                                            this.get_vase,
                                        )
                                    }
                                >
                                    Load Helix Vase
                                </Button>
                                <Button
                                    type={'primary'}
                                    style={{
                                        display: 'block',
                                        marginBottom: '5px',
                                    }}
                                    onClick={() =>
                                        this.setState(
                                            {
                                                helix_list:
                                                    VASE_EXAMPLES['bulb'],
                                                part_text: '',
                                            },
                                            this.get_vase,
                                        )
                                    }
                                >
                                    Load Bulb Vase
                                </Button>
                                <Button
                                    type={'primary'}
                                    style={{
                                        display: 'block',
                                        marginBottom: '5px',
                                    }}
                                    onClick={() =>
                                        this.setState(
                                            {
                                                helix_list:
                                                    VASE_EXAMPLES['braided'],
                                                part_text: '',
                                            },
                                            this.get_vase,
                                        )
                                    }
                                >
                                    Load Braided Vase
                                </Button>
                            </div>

                            {helix_forms}

                            <div className="simple-card">
                                <Button type="primary" onClick={this.submit}>
                                    Update
                                </Button>
                                {this.state.file ? (
                                    <a
                                        className={'btn btn-success'}
                                        href={URL.createObjectURL(
                                            this.state.file,
                                        )}
                                        download={this.state.file.name}
                                    >
                                        Download
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div className="col-9" style={{ padding: '0px' }}>
                        <OBJViewer
                            part_text={this.state.part_text}
                            rotation={Math.PI / 2}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
