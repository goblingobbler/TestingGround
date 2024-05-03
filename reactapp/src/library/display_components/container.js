import React, { Component } from 'react';

import { HEADER_HEIGHT } from 'constants';

class Container extends Component {
    static component_name = 'Container';

    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
        };

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {
        let className = 'container ';
        if (this.props.className) {
            className += this.props.className;
        }

        const style = { ...this.props.style };
        if (this.props.min_height) {
            style.minHeight = this.state.height - HEADER_HEIGHT;
            if (this.props.no_header) {
                style.minHeight = this.state.height;
            }
        }

        return (
            <div className={className} style={style}>
                {this.props.children}
            </div>
        );
    }
}

export default Container;
