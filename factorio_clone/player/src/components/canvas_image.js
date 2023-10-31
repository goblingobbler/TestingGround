import React, { Component } from "react";
import { Image, Group, Rect } from "react-konva";

// custom component that will handle loading image from url
// you may add more logic here to handle "loading" state
// or if loading is failed
// VERY IMPORTANT NOTES:
// at first we will set image state to null
// and then we will set it to native image instance when it is loaded

export default class CanvasImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
        };

        this.loadImage = this.loadImage.bind(this);
        this.handleLoad = this.handleLoad.bind(this);
    }

    componentDidMount() {
        this.loadImage();
    }

    componentDidUpdate(oldProps) {
        if (oldProps.src !== this.props.src) {
            this.loadImage();
        }
    }

    componentWillUnmount() {
        this.image.removeEventListener("load", this.handleLoad);
    }

    loadImage() {
        // save to "this" to remove "load" handler on unmount
        this.image = new window.Image();
        this.image.src = this.props.src;
        this.image.addEventListener("load", this.handleLoad);
    }

    handleLoad = () => {
        // after setState react-konva will update canvas and redraw the layer
        // because "image" property is changed
        this.setState({
            image: this.image,
        });
    };

    render() {
        let position = [this.props.position[0], this.props.position[1]];
        let scaleX = this.props.zoom;
        let scaleY = this.props.zoom;
        let size = this.props.size;

        var opacity = this.props.opacity || 1;
        var scale_multiplier = 1;

        if (this.state.image) {
            scaleX = scaleX * (size[0] / this.state.image.width) * scale_multiplier;
            scaleY = scaleY * (size[1] / this.state.image.height) * scale_multiplier;
        }

        let x = position[0] - size[0] / 2;
        let y = position[1] - size[1] / 2;

        return (
            <Group x={x} y={y}>
                <Image
                    draggable={this.props.draggable}
                    onClick={this.props.onClick}
                    x={0}
                    y={0}
                    scaleX={scaleX}
                    scaleY={scaleY}
                    image={this.state.image}
                    opacity={opacity}
                />

                <Rect
                    x={0}
                    y={0}
                    width={size[0]}
                    height={size[1]}
                    scaleX={this.props.zoom}
                    scaleY={this.props.zoom}
                    stroke="red"
                />
            </Group>
        );
    }
}
