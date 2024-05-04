import React, { Component } from 'react';
import $ from 'jquery';

class Header extends Component {
    constructor(props) {
        super(props);

        this.scroll_to_slide = this.scroll_to_slide.bind(this);
    }

    scroll_to_slide(className) {
        $('html, body')
            .get(0)
            .scrollTo(0, $(className).offset().top - 40);
    }

    render() {
        let links = null;
        if (this.props.links) {
            links = (
                <div className="links">
                    <div
                        className="link"
                        onClick={() => this.scroll_to_slide('.contacts')}
                    >
                        Contact Me
                    </div>
                    <div
                        className="link"
                        onClick={() => this.scroll_to_slide('.skills')}
                    >
                        Skills
                    </div>
                    <div
                        className="link"
                        onClick={() => this.scroll_to_slide('.projects')}
                    >
                        Projects
                    </div>
                    <div
                        className="link"
                        onClick={() => this.scroll_to_slide('.snippets')}
                    >
                        Snippets
                    </div>
                </div>
            );
        }
        return (
            <div className="header">
                <div className="headerInner">
                    {links}
                    <div
                        className="logo link"
                        onClick={function () {
                            window.location = '/';
                        }}
                    >
                        DM
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;
