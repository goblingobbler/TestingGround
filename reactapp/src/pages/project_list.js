import React, { Component } from 'react';

import {} from 'library';

class Project extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <a href={this.props.url} class="project" target="_blank">
                <div class="projectTitle">{this.props.name}</div>
                <img class="projectImage" src={this.props.image} />
            </a>
        );
    }
}

class ProjectList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="slideContainer">
                <div class="welcome slide transitions">
                    <div class="inner">
                        <div class="titleContainer">
                            <div class="title">David Miller</div>
                            <div class="titleUnderline transitions"></div>
                            <div class="titleUnderscore transitions">
                                Freelance Web Developer
                            </div>
                        </div>
                        <div class="titlePitch">
                            I write custom web applications, convert designs
                            into working sites, and troubleshoot existing sites.
                        </div>
                    </div>
                </div>

                <div class="projects slide transitions">
                    <div class="inner">
                        <div class="projectsTitle">All Projects</div>

                        {projects}

                        <a
                            href="https://happiertraveler.com/"
                            class="project"
                            target="_blank"
                        >
                            <div class="projectTitle">Happier Traveler</div>
                            <img class="projectImage" src="static/ht.JPG" />
                        </a>

                        <a
                            href="https://dimension5workflow.com/"
                            class="project"
                            target="_blank"
                        >
                            <div class="projectTitle">Dimension 5</div>
                            <img class="projectImage" src="static/dim5.JPG" />
                        </a>

                        <a
                            href="https://sponsr.com/"
                            class="project"
                            target="_blank"
                        >
                            <div class="projectTitle">Sponsr</div>
                            <img class="projectImage" src="static/sponsr.JPG" />
                        </a>

                        <a
                            href="https://www.framedmarketplace.com/"
                            class="project"
                            target="_blank"
                        >
                            <div class="projectTitle">Framed Marketplace</div>
                            <img
                                class="projectImage"
                                src="static/framedmarketplace.JPG"
                            />
                        </a>

                        <a
                            href="http://sheds.millercodes.com/"
                            class="project"
                            target="_blank"
                        >
                            <div class="projectTitle">Shed Customizer</div>
                            <img class="projectImage" src="static/sheds.JPG" />
                        </a>

                        <a
                            href="https://www.getawalkthrough.com/"
                            class="project"
                            target="_blank"
                        >
                            <div class="projectTitle">Walkthrough</div>
                            <img
                                class="projectImage"
                                src="static/walkthrough.JPG"
                            />
                        </a>

                        <a class="project" target="_blank">
                            <div class="projectTitle">Rumor 2 Release</div>
                            <img
                                class="projectImage"
                                src="static/rumor2release.png"
                            />
                        </a>

                        <a
                            href="https://web.archive.org/web/20160314042411/http://infikno.com"
                            class="project"
                            target="_blank"
                        >
                            <div class="projectTitle">Infikno</div>
                            <img
                                class="projectImage"
                                src="static/infikno.png"
                            />
                        </a>

                        <a
                            href="https://web.archive.org/web/20150331030851/http://tutorspark.io"
                            class="project"
                            target="_blank"
                        >
                            <div class="projectTitle">Tutorspark.io</div>
                            <img
                                class="projectImage"
                                src="static/tutorspark.png"
                            />
                        </a>

                        <a
                            href="https://web.archive.org/web/20160305034435/http://novatorz.com"
                            class="project"
                            target="_blank"
                        >
                            <div class="projectTitle">Novatorz</div>
                            <img
                                class="projectImage"
                                src="static/novatorz.png"
                            />
                        </a>

                        <a
                            href="https://web.archive.org/web/20150125022225/http://beta.lasteats.com:80/"
                            class="project"
                            target="_blank"
                        >
                            <div class="projectTitle">Lasteats</div>
                            <img
                                class="projectImage"
                                src="static/lasteats.png"
                            />
                        </a>

                        <a
                            href="https://web.archive.org/web/20150502205248/http://shrinkjet.dmiller89.webfactional.com:80/"
                            class="project"
                            target="_blank"
                        >
                            <div class="projectTitle">Shrinkjet</div>
                            <img
                                class="projectImage"
                                src="static/shrinkjet.png"
                            />
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProjectList;
