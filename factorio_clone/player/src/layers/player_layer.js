import React, { Component } from "react";
import { Layer, Group, Rect } from "react-konva";

export default class PlayerLayer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layer>
                <Group
                    x={this.props.width / 2}
                    y={this.props.height / 2}
                    scaleX={this.props.zoom}
                    scaleY={this.props.zoom}
                >
                    <Rect x={-25} y={-25} width={50} height={50} stroke="red" />
                </Group>
            </Layer>
        );
    }
}
