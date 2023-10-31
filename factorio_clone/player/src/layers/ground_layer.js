import React, { Component } from "react";
import { Layer, Group } from "react-konva";

import CanvasImage from "../components/canvas_image";

export default class GroundLayer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.load_ground_layer) {
            this.props.load_ground_layer(this.layer_node);
        }
    }

    render() {
        return (
            <Layer
                ref={(node) => {
                    this.layer_node = node;
                }}
                x={-1 * this.props.player_position[0]}
                y={-1 * this.props.player_position[1]}
            >
                <Group
                    x={this.props.layer_position[0]}
                    y={this.props.layer_position[1]}
                    scaleX={this.props.zoom}
                    scaleY={this.props.zoom}
                >
                    <CanvasImage
                        src={"/static/images/test.png"}
                        position={[400, 400]}
                        size={[50, 50]}
                        draggable={false}
                        zoom={1}
                    />
                    <CanvasImage
                        src={"/static/images/test.png"}
                        position={[0, 0]}
                        size={[50, 50]}
                        draggable={false}
                        zoom={1}
                    />

                    {this.props.children}
                </Group>
            </Layer>
        );
    }
}
