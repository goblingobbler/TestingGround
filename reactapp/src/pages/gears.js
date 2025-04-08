import React, { Component } from 'react';

import { Form, TextInput } from 'library';
import { Header, OBJViewer } from 'components';
import { ajax_wrapper } from 'functions';

export default class Gears extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teeth: 10,
            module: 1,

            part_text: '',
        };
    }

    componentDidMount() {
        this.get_gear();
    }

    get_gear = () => {
        ajax_wrapper(
            'POST',
            '/api/gears/create/',
            {
                teeth: this.state.teeth,
                module: this.state.module,
            },
            (value) => this.setState({ part_text: value }),
        );
    };

    submit = (state, callback) => {
        console.log(state);
        this.setState(
            {
                teeth: state['teeth'],
                module: state['module'],
            },
            this.get_gear,
        );

        callback();
    };

    render() {
        return (
            <div style={{ overflow: 'hidden' }}>
                <Header />
                <div className="row">
                    <div className="col-3">
                        <div className="simple-card-container">
                            <div className="simple-card">
                                <Form
                                    submit={this.submit}
                                    defaults={this.state}
                                >
                                    <TextInput
                                        type="number"
                                        name="teeth"
                                        label="Teeth"
                                        required={true}
                                    />
                                    <TextInput
                                        type="number"
                                        name="module"
                                        label="Module"
                                        required={true}
                                    />
                                </Form>
                            </div>
                        </div>
                    </div>
                    <div className="col-9">
                        <OBJViewer part_text={this.state.part_text} />
                    </div>
                </div>
            </div>
        );
    }
}
