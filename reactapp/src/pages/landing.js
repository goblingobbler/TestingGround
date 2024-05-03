import React, { Component } from 'react';
import $ from 'jquery';

import { Image } from 'library';

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

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 500,
            scroll: 0,
        };

        this.scroll_to_slide = this.scroll_to_slide.bind(this);
    }

    componentDidMount() {
        this.setState(
            { scroll: $(window).scrollTop() },
            function () {
                if (this.state.scroll > 0) {
                    $('.titleUnderline').hide();
                    $('.titleUnderscore').hide();
                    setTimeout(function () {
                        $('.titleUnderline').show();
                        $('.titleUnderscore').show();
                    }, this.state.time / 20);
                } else {
                    setTimeout(
                        function () {
                            $('.titleUnderline').width(500);
                            setTimeout(function () {
                                $('.titleUnderscore').css('top', 0);
                            }, this.state.time / 2);
                        }.bind(this),
                        this.state.time,
                    );
                }
            }.bind(this),
        );
    }

    scroll_to_slide(className) {
        $('html, body')
            .get(0)
            .scrollTo(0, $(className).offset().top - 40);
    }

    render() {
        let delay = 250;
        if (this.state.scroll > 0) {
            delay = 20;
        }

        let slides = [
            <Slide delay={delay} name="contacts">
                <div className="inner">
                    <table style={{ width: '100%' }}>
                        <tr>
                            <td
                                width="50%"
                                style={{
                                    textAlign: 'right',
                                    borderRight: 'thin solid rgba(0,0,0,.2)',
                                }}
                            >
                                <a
                                    href="mailto:dmiller89@gmail.com"
                                    className="contact email"
                                >
                                    dmiller89@gmail.com
                                    <Image
                                        src="static/images/mail.png"
                                        alt="mail"
                                    />
                                </a>
                            </td>
                            <td width="50%" style={{ textAlign: 'left' }}>
                                <div className="contact phone">
                                    <Image
                                        src="static/images/phone.png"
                                        alt="phone"
                                    />
                                    203-918-9861
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </Slide>,

            <Slide delay={delay * 2} name="skills">
                <div className="inner">
                    <div className="skill">
                        <div className="skillTitle">Front-End</div>
                        <div className="skillItems">
                            <Image
                                className="transitions"
                                alt="HTML"
                                src="static/images/htmlLogo.png"
                            />
                            <Image
                                className="transitions"
                                alt="CSS"
                                src="static/images/css3Logo.png"
                            />
                            <Image
                                className="transitions"
                                alt="JavaScript/Jquery"
                                src="static/images/jQueryLogo.jpg"
                            />
                            <Image
                                className="transitions"
                                alt="React"
                                src="static/images/react.png"
                            />
                        </div>
                    </div>

                    <div className="skill">
                        <div className="skillTitle">Applications</div>
                        <div className="skillItems">
                            <Image
                                className="transitions"
                                alt="Python"
                                src="static/images/pythonLogo.png"
                            />
                            <Image
                                className="transitions"
                                alt="Django"
                                src="static/images/django.png"
                            />
                            <Image
                                className="transitions"
                                alt="Node"
                                src="static/images/node.png"
                            />
                            <Image
                                className="transitions"
                                alt="Apache"
                                src="static/images/apache.png"
                            />
                            <Image
                                className="transitions"
                                alt="AWS"
                                src="static/images/aws.png"
                            />
                        </div>
                    </div>

                    <div className="skill">
                        <div className="skillTitle">Databases</div>
                        <div className="skillItems">
                            <Image
                                className="transitions"
                                alt="MongoDB"
                                src="static/images/mongoDbLogo.png"
                            />
                            <Image
                                className="transitions"
                                alt="MySQL"
                                src="static/images/mySqlLogo.jpg"
                            />
                            <Image
                                className="transitions"
                                alt="Postgres"
                                src="static/images/postgres.jpg"
                            />
                        </div>
                    </div>
                </div>
            </Slide>,

            <Slide delay={delay * 3} name="projectsHeader">
                <div className="inner">
                    <div className="projectsTitle">Past Projects</div>
                </div>
            </Slide>,

            <Slide delay={delay * 4} name="projects">
                <div className="inner">
                    <a
                        href="https://happiertraveler.com/"
                        className="project"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <div className="projectTitle">Happier Traveler</div>
                        <Image
                            className="projectImage"
                            src="static/images/ht.JPG"
                            alt="happier"
                        />
                    </a>

                    <a
                        href="https://dimension5workflow.com/"
                        className="project"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <div className="projectTitle">Dimension 5</div>
                        <Image
                            className="projectImage"
                            src="static/images/dim5.JPG"
                            alt="dim5"
                        />
                    </a>

                    <a
                        href="https://sponsr.com/"
                        className="project"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <div className="projectTitle">Sponsr</div>
                        <Image
                            className="projectImage"
                            src="static/images/sponsr.JPG"
                            alt="sponsr"
                        />
                    </a>

                    <a
                        href="https://www.framedmarketplace.com/"
                        className="project"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <div className="projectTitle">Framed Marketplace</div>
                        <Image
                            className="projectImage"
                            src="static/images/framedmarketplace.JPG"
                            alt="framed"
                        />
                    </a>

                    <a
                        href="http://sheds.millercodes.com/"
                        className="project"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <div className="projectTitle">Shed Customizer</div>
                        <Image
                            className="projectImage"
                            src="static/images/sheds.JPG"
                            alt="sheds"
                        />
                    </a>

                    <a
                        href="https://www.getawalkthrough.com/"
                        className="project"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <div className="projectTitle">Walkthrough</div>
                        <Image
                            className="projectImage"
                            src="static/images/walkthrough.JPG"
                            alt="walkthrough"
                        />
                    </a>

                    <br />
                    <br />
                    <br />
                    <div>
                        <a
                            href="/all_projects.html"
                            className="btn btn-secondary"
                            style={{
                                fontSize: '22px',
                                padding: '10px 50px',
                            }}
                        >
                            All Projects
                        </a>
                    </div>
                    <br />
                    <br />
                    <br />
                </div>
            </Slide>,

            <Slide delay={delay * 5} name="snippets">
                <div className="inner">
                    <div className="snippetsTitle">Experimental Snippets</div>
                    <a href="checkers.html" className="snip">
                        <div className="snipTitle">Checkers</div>
                        <div className="snipDesc">
                            A simple checkers game build with jQuery
                        </div>
                    </a>

                    <a href="solar-system.html" className="snip">
                        <div className="snipTitle">Solar System</div>
                        <div className="snipDesc">
                            The planets depicted in css
                        </div>
                    </a>

                    <a href="circles.html" className="snip">
                        <div className="snipTitle">Circles</div>
                        <div className="snipDesc">
                            An experiment with perspective
                        </div>
                    </a>

                    <a href="clock.html" className="snip">
                        <div className="snipTitle">Clock</div>
                        <div className="snipDesc">
                            A calming clock to help you track time in style
                        </div>
                    </a>

                    <a href="colors.html" className="snip">
                        <div className="snipTitle">Colors</div>
                        <div className="snipDesc">
                            Explore the color spectrum
                        </div>
                    </a>

                    <a href="rts_demo/index.html" className="snip">
                        <div className="snipTitle">RTS Demo</div>
                        <div className="snipDesc">
                            WORK IN PROGRESS
                            <br />
                            Creating a RTS game using HTML
                        </div>
                    </a>
                </div>
            </Slide>,
        ];

        return (
            <div>
                <div className="header">
                    <div className="headerInner">
                        <div className="links">
                            <div
                                className="link"
                                onClick={() =>
                                    this.scroll_to_slide('.contacts')
                                }
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
                                onClick={() =>
                                    this.scroll_to_slide('.projects')
                                }
                            >
                                Projects
                            </div>
                            <div
                                className="link"
                                onClick={() =>
                                    this.scroll_to_slide('.snippets')
                                }
                            >
                                Snippets
                            </div>
                        </div>
                        <div
                            className="logo link"
                            onClick={() => this.scroll_to_slide('.welcome')}
                        >
                            DM
                        </div>
                    </div>
                </div>

                <div className="slideContainer">
                    <div className="welcome slide transitions">
                        <div className="inner">
                            <div className="titleContainer">
                                <div className="title">David Miller</div>
                                <div className="titleUnderline transitions"></div>
                                <div className="titleUnderscore transitions">
                                    Freelance Web Developer
                                </div>
                            </div>
                            <div className="titlePitch">
                                I write custom web applications, convert designs
                                into working sites, and troubleshoot existing
                                sites.
                            </div>
                        </div>
                    </div>
                    {slides}
                </div>
            </div>
        );
    }
}

export default Landing;
