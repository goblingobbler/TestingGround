import React, { Component } from 'react';

import { Header, OBJViewer } from 'components';
import { ajax_wrapper } from 'functions';

export default class Gears extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {}

    render() {
        return (
            <div>
                <Header />
                <OBJViewer />
            </div>
        );
    }
}
