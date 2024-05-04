import React, { Component } from 'react';

class Slide extends Component {
    constructor(props) {
        super(props);
        this.state = { show: false };
    }

    componentDidMount() {
        setTimeout(
            function () {
                this.setState({ show: true });
            }.bind(this),
            this.props.delay,
        );
    }

    render() {
        return (
            <div
                class={`${this.props.name} slide transitions${
                    this.state.show ? ' shown' : ''
                }`}
            >
                {this.props.children}
            </div>
        );
    }
}

export default Slide;
