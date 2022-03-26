import React, { Component } from 'react';
import './App.css';

import Noise from './noise.js';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
        };

        this.getURL = this.getURL.bind(this);
    }

    componentDidMount() {
        var path = this.getURL()[0].toLowerCase();

        this.setState({'loaded':true});
    }

    getURL() {
        var url = window.location.pathname;
        if (url[0] == '/'){ url = url.substring(1);}
        if (url[url.length - 1] == '/'){ url = url.substring(0,url.length-1);}
        var url_split = url.split('/');

        var params = {};
        for (var index in url_split) {
            params[index] = url_split[index]
        }

        var href = window.location.href;
        if (href.endsWith("#")) {
            href = href.substring(0, href.length - 1)
        }
        if (href.indexOf('?') > -1) {
            console.log("Here")
            var post_params = href.split('?')[1];
            var split_params = post_params.split('&');
            console.log("Post Params", post_params, split_params);

            for (var index in split_params) {
                var temp = split_params[index]
                var temp_split = temp.split('=')
                params[temp_split[0]] = temp_split[1]
            }
        }

        return params;
    }

    render() {
        var params = this.getURL();
        var param_dict = {};
        for (var index in params) {
            param_dict[index.toString()] = params[index];
        }

        var route = params[0].toLowerCase();
        var content = <h1>Loading . . . </h1>;
        console.log("Route!", route);

        if (this.state.loaded) {
            content = <Noise params={params} />
        }
        return (
            content
        );
    }
}

export default App;
