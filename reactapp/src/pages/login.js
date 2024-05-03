import React, { Component } from 'react';

import { ajax_wrapper } from 'functions';
import { Form, TextInput, Container, Alert } from 'library';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = { email: '', error: '' };

        this.submit = this.submit.bind(this);
        this.callback = this.callback.bind(this);
    }

    submit(state) {
        let data = {
            email: state['email'],
            password: state['password'],
        };
        data.email = data.email.toLowerCase();

        ajax_wrapper('POST', '/user/token/', data, this.callback);
    }

    callback(value) {
        if ('error' in value) {
            if (value.error === 'Invalid Credentials') {
                this.setState({
                    error: (
                        <p>
                            Wrong Email or Password. If this is your first time
                            logging in, you may need to{' '}
                            <a href="/password_reset_request/">
                                reset your password first.
                            </a>
                        </p>
                    ),
                });
            } else {
                this.setState({ error: value.error });
            }
        } else {
            localStorage.setItem('token', value.access);
            localStorage.setItem('refresh_token', value.refresh);
            localStorage.setItem('token_time', new Date());

            if (localStorage.getItem('redirect')) {
                window.location.href = localStorage.getItem('redirect');
                localStorage.removeItem('redirect');
            } else {
                window.location.href = '/home';
            }
        }
    }

    render() {
        let error = null;
        if (this.state.error !== '') {
            error = <Alert type="danger">{this.state.error}</Alert>;
        }
        return (
            <Container>
                <Form submit={this.submit}>
                    <TextInput name="email" label="Email" required={true} />
                    <TextInput
                        type="password"
                        name="password"
                        label="Password"
                        required={true}
                    />
                </Form>
                {error}
            </Container>
        );
    }
}

export default Login;
