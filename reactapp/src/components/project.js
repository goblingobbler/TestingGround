import React, { Component } from 'react';

import { Link, Image } from 'library';

export default class Project extends Component {
    render() {
        return (
            <Link href={this.props.url} className="project" new_tab={true}>
                <div className="projectTitle">{this.props.name}</div>
                <Image className="projectImage" src={this.props.image} />
            </Link>
        );
    }
}
