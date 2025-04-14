import React, { Component } from 'react';

import { Form, TextInput, Select, Radios } from 'library';

export default class HelixForm extends Component {
    render() {
        return (
            <Form
                global_state_name={`${this.props.index}`}
                auto_set_global_state={true}
                set_global_state={this.props.update}
                defaults={this.props.data}
            >
                <div className="row">
                    <TextInput
                        className="col-6"
                        type="number"
                        name="radial_distance"
                        label="radial_distance"
                        required={true}
                    />
                    <TextInput
                        className="col-6"
                        type="number"
                        name="polar_angle"
                        label="polar_angle"
                        required={true}
                    />
                    <TextInput
                        className="col-6"
                        type="number"
                        name="steps"
                        label="steps"
                        required={true}
                    />
                    <TextInput
                        className="col-6"
                        type="number"
                        name="height"
                        label="height"
                        required={true}
                    />
                    <TextInput
                        className="col-6"
                        type="number"
                        name="rotation_about_center"
                        label="rotation_about_center"
                        required={true}
                    />
                    <Radios
                        className="col-6"
                        boolean={true}
                        name="reverse"
                        label="reverse"
                    />

                    <div className="page-break col-12"></div>

                    <TextInput
                        className="col-6"
                        type="number"
                        name="circle_radius"
                        label="circle_radius"
                        required={true}
                    />
                    <TextInput
                        className="col-6"
                        type="number"
                        name="circle_points"
                        label="circle_points"
                        required={true}
                    />
                    <TextInput
                        className="col-6"
                        type="number"
                        name="ossilation"
                        label="ossilation"
                        required={true}
                    />
                    <TextInput
                        className="col-6"
                        type="number"
                        name="ossilation_steps"
                        label="ossilation_steps"
                        required={true}
                    />
                    <TextInput
                        className="col-6"
                        type="number"
                        name="ossilation_start"
                        label="ossilation_start"
                        required={true}
                    />
                    <TextInput
                        className="col-6"
                        type="number"
                        name="rotation_about_self"
                        label="rotation_about_self"
                        required={true}
                    />
                    <Radios
                        className="col-6"
                        boolean={true}
                        name="rotation_reverse"
                        label={'rotation_reverse'}
                    />
                </div>
            </Form>
        );
    }
}
