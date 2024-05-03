import React, { Component } from 'react';

import { ajax_wrapper } from 'functions';
import { Loading } from 'library';

class ContextLoader extends Component {
    constructor(props) {
        super(props);
        this.state = { loaded: false };

        this.load_context = this.load_context.bind(this);
        this.load_user = this.load_user.bind(this);
    }

    componentDidMount() {
        ajax_wrapper('GET', '/api/csrfmiddlewaretoken/', {}, this.load_context);
    }

    load_context(value) {
        window.secret_react_state.set_global_state(value);

        ajax_wrapper('GET', '/user/user/', {}, this.load_user);
    }

    load_user(value) {
        window.secret_react_state.set_global_state('user', value);

        this.setState({
            loaded: true,
        });
    }

    render() {
        return (
            <Loading loaded={this.state.loaded}>{this.props.children}</Loading>
        );
    }
}

export default ContextLoader;
