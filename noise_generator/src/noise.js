import React, { Component } from 'react';

import random_noise from './algorithms/random.js';
import Pixel from './visualization/pixel.js';
import Controller from './visualization/controller.js';


class Noise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            settings: {
                type: 'random',
                size: 10,
                interval: 200,
            },

            starting_timestamp: Date.now(),
            current_timestamp: null,
        };

        this.resize =  this.resize.bind(this);
        this.make_noise =  this.make_noise.bind(this);
        this.update_settings =  this.update_settings.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize);

        this.resize();
        this.make_noise();
    }

    resize(){
        var width = window.innerWidth;
        var height = window.innerHeight;

        this.setState({
            width: width,
            height: height,
        });
    }

    update_settings(settings){
        if (settings.size > 100){ settings.size = 100;}
        if (settings.size < 1){ settings.size = 1;}
        if (settings.interval < 200){ settings.interval = 200;}

        this.setState({
            settings: settings,
        });
    }

    make_noise(){
        this.setState({
            current_timestamp: Date.now(),
        });

        var interval = this.state.settings.interval;

        setTimeout(function(){
            this.make_noise();
        }.bind(this), interval);
    }


    render() {
        var params = this.props.params;

        var content = null;
        if (this.state.loaded) {
            var container_style = {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                height: this.state.height + 'px',
            };

            var pixels = [];
            var data = random_noise(this.state.settings);

            for (var i=0;i<data.length;i++){
                var pixel_row = [];

                for (var j=0;j<data[i].length;j++){
                    var value = data[i][j];

                    pixel_row.push(<Pixel value={value} interval={this.state.settings.interval} />);
                }

                pixels.push(<div style={{display:'flex'}}>{pixel_row}</div>);
            }

            content = <div style={container_style} >
                <Controller settings={this.state.settings} update_settings={this.update_settings} />
                <div>
                    {pixels}
                </div>
            </div>;
        }

        return (
            content
        );
    }
}

export default Noise;
