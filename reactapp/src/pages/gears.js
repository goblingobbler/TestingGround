import React, { Component } from 'react';

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

    render() {
        return (
            <div style={{ overflow: 'hidden' }}>
                <Header />
                <div className="row">
                    <div className="col-3"></div>
                    <div className="col-9">
                        <OBJViewer part_text={this.state.part_text} />
                    </div>
                </div>
            </div>
        );
    }
}
