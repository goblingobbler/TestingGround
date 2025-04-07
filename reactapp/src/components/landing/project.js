import React, { Component } from 'react';

import { Link } from 'library';

export default class Project extends Component {
    render() {
        return (
            <Link
                href={this.props.url}
                className="project simple-card"
                new_tab={true}
            >
                <div className="project-title">{this.props.name}</div>
                <div
                    className="background-img project-image"
                    style={{ backgroundImage: `url("${this.props.image}")` }}
                ></div>
            </Link>
        );
    }
}
