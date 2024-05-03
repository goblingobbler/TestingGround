import React from 'react';

class Link extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let new_tab = this.props.new_tab
            ? {
                  target: '_blank',
                  rel: 'noreferrer',
              }
            : {};

        return (
            <a href="https://happiertraveler.com/" className="project" {..new_tab}>
                <div className="projectTitle">{this.props.name}</div>
                <Image
                    className="projectImage"
                    src={this.props.image}
                />
            </a>
        );
    }
}

export default Link;
