import React, { Component } from 'react';
import $ from 'jquery';

class Banner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 300,
        };
    }

    componentDidMount() {
        setTimeout(
            function () {
                $('.title-underline').width(500);
                setTimeout(function () {
                    $('.title-underscore').css('top', 0);
                }, this.state.time / 2);
            }.bind(this),
            this.state.time,
        );
    }

    render() {
        return (
            <div className="welcome slide transitions">
                <div className="inner">
                    <div className="title-container">
                        <div className="title">David Miller</div>
                        <div className="title-underline transitions"></div>
                        <div className="title-underscore transitions">
                            Freelance Web Developer
                        </div>
                    </div>
                    <div className="title-pitch">
                        I write custom web applications, convert designs into
                        working sites, and troubleshoot existing sites.
                    </div>
                </div>
            </div>
        );
    }
}

export default Banner;
