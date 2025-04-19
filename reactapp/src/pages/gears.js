import React, { Component } from 'react';
import { HEADER_HEIGHT } from 'constants';

import { Button, Form, TextInput } from 'library';
import { Header, OBJViewer } from 'components';
import { ajax_wrapper } from 'functions';

export default class Gears extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {
                teeth: 10,
                module: 1,
                width: 2,
                xy_inset: 0.2,
                z_inset: 0.4,
                shaft_width: 2,
            },

            part_text: '',
            file: null,
        };
    }

    componentDidMount() {
        this.get_gear();
    }

    get_gear = () => {
        ajax_wrapper(
            'POST',
            '/api/objects/create_gear/',
            this.state.data,
            function (value) {
                let file = new File([value], 'gear.stl');
                this.setState({ part_text: value, file: file });
            }.bind(this),
        );
    };

    submit = (state, callback) => {
        console.log(state);
        this.setState(
            {
                data: state,
                part_text: '',
            },
            function () {
                this.get_gear();
                callback();
            },
        );
    };

    render() {
        return (
            <div style={{ overflow: 'hidden', marginTop: HEADER_HEIGHT }}>
                <Header />
                <div className="row" style={{ margin: '0px' }}>
                    <div className="col-3" style={{ padding: '0px' }}>
                        <div className="simple-card-container">
                            <div className="simple-card">
                                <h3>Gear Generator</h3>
                            </div>
                            <div className="simple-card">
                                <Form
                                    submit={this.submit}
                                    defaults={this.state.data}
                                    submit_text="Update"
                                    submit_className="standoff"
                                >
                                    <div className="row">
                                        <TextInput
                                            className="col-6"
                                            type="number"
                                            name="teeth"
                                            label="Teeth"
                                            required={true}
                                        />
                                        <TextInput
                                            className="col-6"
                                            type="number"
                                            name="module"
                                            label="Module"
                                            required={true}
                                        />
                                        <TextInput
                                            className="col-6"
                                            type="number"
                                            name="width"
                                            label="Width"
                                            required={true}
                                        />
                                        <TextInput
                                            className="col-6"
                                            type="number"
                                            name="xy_inset"
                                            label="XY Inset"
                                            required={true}
                                        />
                                        <TextInput
                                            className="col-6"
                                            type="number"
                                            name="z_inset"
                                            label="Z Inset"
                                            required={true}
                                        />
                                        <TextInput
                                            className="col-6"
                                            type="number"
                                            name="shaft_width"
                                            label="Shaft Width"
                                            required={true}
                                        />
                                        <div className="col-12">
                                            <br />
                                        </div>
                                    </div>
                                </Form>
                            </div>
                            <div className="simple-card">
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
                            vertical_offset={5}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
