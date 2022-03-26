import React, { Component } from 'react';


class Pixel extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        var value = this.props.value;

        var interval = String((this.props.interval/1000).toFixed(2));

        var style = {
            display: 'inline-block',
            width: '10px',
            height: '10px',
            background: 'rgba('+value+','+value+','+value+',1)',
            //transition: 'background '+ interval +'s',
        };

        var content = <div style={style}></div>

        return (
            content
        );
    }
}

export default Pixel;
