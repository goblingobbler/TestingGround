import React, { Component } from 'react';
import { HEADER_HEIGHT } from 'constants';

import { Button, Form, TextInput } from 'library';
import { Header, OBJViewer } from 'components';
import { ajax_wrapper } from 'functions';

export default class Vases extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teeth: 10,
            module: 1,

            part_text: '',
            file: null,
        };
    }

    componentDidMount() {
        this.get_vase();
    }

    get_vase = () => {
        ajax_wrapper(
            'POST',
            '/api/objects/create_vase/',
            {},
            function (value) {
                let file = new File([value], 'vase.stl');
                this.setState({ part_text: value, file: file });
            }.bind(this),
        );
    };

    submit = (state, callback) => {
        console.log(state);
        this.setState(
            {
                part_text: '',
            },
            function () {
                this.get_vase();
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
                                <Form
                                    submit={this.submit}
                                    defaults={this.state}
                                    submit_text="Update"
                                >
                                    <br />
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
                            rotation={Math.PI / 2}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
