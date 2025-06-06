import React, { Component } from 'react';

import { Image, Slide } from 'library';
import { Header, Banner, Project } from 'components';
import { ajax_wrapper } from 'functions';

export default class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = { projects: [] };
    }

    componentDidMount() {
        ajax_wrapper('GET', '/api/get_projects/?live=true', {}, (value) =>
            this.setState({ projects: value }),
        );
    }

    render() {
        let delay = 100;

        let projects = [];
        for (let item of this.state.projects) {
            projects.push(
                <Project
                    name={item['name']}
                    url={item['url']}
                    image={item['image']}
                />,
            );
            if (projects.length >= 6) {
                break;
            }
        }

        let slides = [
            <Slide delay={300 + delay} name="contacts">
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

            <Slide delay={300 + delay * 2} name="skills">
                <div className="inner">
                    <div className="skill simple-card">
                        <div className="simple-card-header skill-title">
                            Front-End
                        </div>
                        <div className="skill-items">
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

                    <div className="skill simple-card">
                        <div className="simple-card-header skill-title">
                            Applications
                        </div>
                        <div className="skill-items">
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

                    <div className="skill simple-card">
                        <div className="simple-card-header skill-title">
                            Databases
                        </div>
                        <div className="skill-items">
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

            <Slide delay={300 + delay * 3} name="projects-header">
                <div className="inner">
                    <div className="projects-title">Past Projects</div>
                </div>
            </Slide>,

            <Slide delay={300 + delay * 4} name="projects">
                <div className="inner">
                    {projects}

                    <div style={{ margin: '40px 0px 60px' }}>
                        <a
                            href="/all_projects"
                            className="btn btn-secondary"
                            style={{
                                fontSize: '22px',
                                padding: '10px 50px',
                            }}
                        >
                            All Projects
                        </a>
                    </div>
                </div>
            </Slide>,

            <Slide delay={300 + delay * 5} name="snippets">
                <div className="inner">
                    <div className="snippets-title">Experimental Snippets</div>
                    <a href="checkers" className="snip">
                        <div className="snip-title">Checkers</div>
                        <div className="snip-desc">
                            A simple checkers game build with jQuery
                        </div>
                    </a>

                    <a href="solar-system" className="snip">
                        <div className="snip-title">Solar System</div>
                        <div className="snip-desc">
                            The planets depicted in css
                        </div>
                    </a>

                    <a href="circles" className="snip">
                        <div className="snip-title">Circles</div>
                        <div className="snip-desc">
                            An experiment with perspective
                        </div>
                    </a>

                    <a href="clock" className="snip">
                        <div className="snip-title">Clock</div>
                        <div className="snip-desc">
                            A calming clock to help you track time in style
                        </div>
                    </a>

                    <a href="colors" className="snip">
                        <div className="snip-title">Colors</div>
                        <div className="snip-desc">
                            Explore the color spectrum
                        </div>
                    </a>

                    <a href="rts-demo" className="snip">
                        <div className="snip-title">RTS Demo</div>
                        <div className="snip-desc">
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
                <Header links={true} />

                <div className="slide-container">
                    <Banner />
                    {slides}
                </div>
            </div>
        );
    }
}
