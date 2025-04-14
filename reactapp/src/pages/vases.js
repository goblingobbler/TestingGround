import React, { Component } from 'react';
import { HEADER_HEIGHT } from 'constants';

import { Button, Form } from 'library';
import { Header, OBJViewer, HelixForm } from 'components';
import { ajax_wrapper } from 'functions';

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
            { type: this.state.type },
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
                                            { type: 'helix', part_text: '' },
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
                                            { type: 'bulb', part_text: '' },
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
                                            { type: 'braided', part_text: '' },
                                            this.get_vase,
                                        )
                                    }
                                >
                                    Load Braided Vase
                                </Button>
                            </div>
                            
                            {helix_forms}

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
