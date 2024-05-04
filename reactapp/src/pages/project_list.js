import React, { Component } from 'react';

import { Slide } from 'library';
import { ajax_wrapper } from 'functions';
import { Header, Banner, Project } from 'components';

class ProjectList extends Component {
    constructor(props) {
        super(props);
        this.state = { projects: [] };
    }

    componentDidMount() {
        ajax_wrapper('GET', '/api/get_projects/', {}, (value) =>
            this.setState({ projects: value }),
        );
    }

    render() {
        let projects = [];
        for (let item of this.state.projects) {
            projects.push(
                <Project
                    name={item['name']}
                    url={item['url']}
                    image={item['image']}
                />,
            );
        }

        return (
            <div>
                <Header />
                <div class="slideContainer">
                    <Banner />

                    <Slide delay={250} name="projects">
                        <div class="inner">
                            <div class="projectsTitle">All Projects</div>

                            {projects}
                        </div>
                    </Slide>
                </div>
            </div>
        );
    }
}

export default ProjectList;
