import React from 'react';

class Link extends React.Component {
    render() {
        let new_tab = this.props.new_tab
            ? {
                  target: '_blank',
                  rel: 'noreferrer',
              }
            : {};

        return (
            <a
                href={this.props.href}
                className={this.props.className}
                {...new_tab}
            >
                {this.props.children}
            </a>
        );
    }
}

export default Link;
