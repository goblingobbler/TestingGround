import React, { Component } from 'react';
import { HEADER_HEIGHT } from 'constants';

import { Button, Form, Accordion } from 'library';
import { Header, OBJViewer, HelixForm } from 'components';
import { ajax_wrapper } from 'functions';

const VASE_EXAMPLES = {
    helix: [
        {
            show: true,
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
            ossilation_start: 90,
            rotation_about_self: 360,
            rotation_reverse: false,
        },
        {
            show: true,
            radial_distance: 4.2,
            polar_angle: 0,
            steps: 50,
            height: 20,
            rotation_about_center: 180,
            reverse: false,
            circle_radius: 2,
            circle_points: 8,
            rotation_about_self: 0,
            rotation_reverse: false,
        },
        {
            show: true,
            radial_distance: 4.2,
            polar_angle: 180,
            steps: 50,
            height: 20,
            rotation_about_center: 180,
            reverse: false,
            circle_radius: 2,
            circle_points: 8,
            rotation_about_self: 0,
            rotation_reverse: false,
        },
        {
            show: true,
            radial_distance: 4.2,
            polar_angle: -90,
            steps: 50,
            height: 20,
            rotation_about_center: 180,
            reverse: false,
            circle_radius: 2,
            circle_points: 8,
            rotation_about_self: 0,
            rotation_reverse: false,
        },
        {
            show: true,
            radial_distance: 4.2,
            polar_angle: 90,
            steps: 50,
            height: 20,
            rotation_about_center: 180,
            reverse: false,
            circle_radius: 2,
            circle_points: 8,
            rotation_about_self: 0,
            rotation_reverse: false,
        },
    ],
    braided: [
        {
            show: true,
            radial_distance: 0,
            polar_angle: 0,
            steps: 48,
            height: 19.2,
            rotation_about_center: 180,
            reverse: false,
            circle_radius: 5,
            circle_points: 24,
            rotation_reverse: false,
        },
    ],
    bulb: [
        {
            show: true,
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
            ossilation_start: 90,
            rotation_reverse: false,
        },
    ],
};

const BRAIDED_CHILDREN = [
    {
        show: true,
        radial_distance: 5,
        polar_angle: 0,
        steps: 48,
        height: 19.2,
        rotation_about_center: 180,
        reverse: false,
        circle_radius: 2,
        circle_points: 24,
        rotation_reverse: false,
    },
    {
        show: true,
        radial_distance: 5,
        polar_angle: 0,
        steps: 48,
        height: 19.2,
        rotation_about_center: 180,
        reverse: true,
        circle_radius: 2,
        circle_points: 24,
        rotation_reverse: false,
    },
];

let polar_angle = 0;
while (polar_angle < 360) {
    for (let item of BRAIDED_CHILDREN) {
        VASE_EXAMPLES['braided'].push(
            Object.assign({}, item, { polar_angle: polar_angle }),
        );
    }
    polar_angle += 45;
}

const BULB_CHILDREN = [
    {
        show: true,
        radial_distance: 5,
        polar_angle: 0,
        steps: 48,
        height: 19.2,
        rotation_about_center: 0,
        reverse: false,
        circle_radius: 2,
        circle_points: 24,
        ossilation: 2,
        ossilation_steps: 48,
        ossilation_start: 270,
        rotation_reverse: false,
    },
];

polar_angle = 0;
while (polar_angle < 360) {
    for (let item of BULB_CHILDREN) {
        VASE_EXAMPLES['bulb'].push(
            Object.assign({}, item, { polar_angle: polar_angle }),
        );
    }
    polar_angle += 45;
}

const HELIX_DEFAULT = {
    show: true,
};

function copy_helix_list(data) {
    let new_list = [];
    let timestamp = Date.now();

    for (let item of data) {
        let new_item = Object.assign({}, item);
        new_item['timestamp'] = timestamp;

        new_list.push(new_item);

        timestamp += 1;
    }

    return new_list;
}

export default class Vases extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teeth: 10,
            module: 1,

            type: 'helix',
            part_text: '',
            file: null,

            helix_list: copy_helix_list(VASE_EXAMPLES['bulb']),
        };

        this.container = React.createRef();
    }

    componentDidMount() {
        this.get_vase();
    }

    get_vase = () => {
        let final_list = [];
        for (let item of this.state.helix_list) {
            if (!item['show']) {
                continue;
            }

            final_list.push(item);
        }

        ajax_wrapper(
            'POST',
            '/api/objects/create_vase/',
            { helix_list: final_list },
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

    copy_helix = (data) => {
        let new_helix = Object.assign({}, data);
        this.state.helix_list.push(new_helix);

        this.setState({
            helix_list: this.state.helix_list,
        });
    };

    delete_helix = (index) => {
        this.state.helix_list.splice(index, 1);

        this.setState({
            helix_list: this.state.helix_list,
        });
    };

    render() {
        let helix_forms = [];
        for (let item of this.state.helix_list) {
            let index = this.state.helix_list.indexOf(item);
            helix_forms.push(
                <Accordion index={index} name={`Helix ${index}`}>
                    <HelixForm
                        key={item['timestamp']}
                        index={index}
                        data={item}
                        update={this.update}
                        copy_helix={this.copy_helix}
                        delete_helix={this.delete_helix}
                    />
                </Accordion>,
            );
        }

        let max_height = 0;
        if (this.container.current) {
            let parent_postition =
                this.container.current.getBoundingClientRect();
            max_height = window.innerHeight - parent_postition.top;
        }

        return (
            <div style={{ overflow: 'hidden', marginTop: HEADER_HEIGHT }}>
                <Header />
                <div className="row" style={{ margin: '0px' }}>
                    <div
                        className="col-xxl-3 col-xl-4 col-md-5 col-6"
                        ref={this.container}
                        style={{
                            padding: '0px',
                            maxHeight: `${max_height}px`,
                            overflowY: 'auto',
                        }}
                    >
                        <div className="simple-card-container">
                            <div className="simple-card">
                                <h3>Vase Generator</h3>
                            </div>
                            <div className="simple-card">
                                <div style={{ paddingBottom: '10px' }}>
                                    <h5>Examples</h5>

                                    <Button
                                        type={'primary'}
                                        className="standoff"
                                        onClick={() =>
                                            this.setState(
                                                {
                                                    helix_list: copy_helix_list(
                                                        VASE_EXAMPLES['bulb'],
                                                    ),
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
                                        className="standoff"
                                        onClick={() =>
                                            this.setState(
                                                {
                                                    helix_list: copy_helix_list(
                                                        VASE_EXAMPLES['helix'],
                                                    ),
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
                                        className="standoff"
                                        onClick={() =>
                                            this.setState(
                                                {
                                                    helix_list: copy_helix_list(
                                                        VASE_EXAMPLES[
                                                            'braided'
                                                        ],
                                                    ),
                                                    part_text: '',
                                                },
                                                this.get_vase,
                                            )
                                        }
                                    >
                                        Load Braided Vase
                                    </Button>
                                </div>
                                <div>
                                    <h5>Actions</h5>
                                    <Button
                                        type={'success'}
                                        className="standoff"
                                        onClick={function () {
                                            let new_item = Object.assign(
                                                {},
                                                HELIX_DEFAULT,
                                            );
                                            new_item['timestamp'] = Date.now();

                                            this.state.helix_list.push(
                                                new_item,
                                            );

                                            this.setState({
                                                helix_list:
                                                    this.state.helix_list,
                                            });
                                        }.bind(this)}
                                    >
                                        Add Helix
                                    </Button>
                                    <Button
                                        type={'warning'}
                                        className="standoff"
                                        onClick={function () {
                                            let new_item = Object.assign(
                                                {},
                                                HELIX_DEFAULT,
                                            );
                                            new_item['timestamp'] = Date.now();

                                            this.state.helix_list = [new_item];
                                            this.setState({
                                                helix_list:
                                                    this.state.helix_list,
                                            });
                                        }.bind(this)}
                                    >
                                        Restart
                                    </Button>
                                </div>
                            </div>

                            <div className="simple-card">{helix_forms}</div>

                            <div className="simple-card">
                                <Button
                                    className="standoff"
                                    type="primary"
                                    onClick={this.submit}
                                >
                                    Update Model
                                </Button>
                                {this.state.file ? (
                                    <a
                                        className={'btn btn-success standoff'}
                                        href={URL.createObjectURL(
                                            this.state.file,
                                        )}
                                        download={this.state.file.name}
                                    >
                                        Download STL
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div
                        className="col-xxl-9 col-xl-8 col-md-7 col-6"
                        style={{ padding: '0px' }}
                    >
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
