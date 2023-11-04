import React, { Component } from "react";
import { Layer, Group, Rect, Text, Image } from "react-konva";

import { ITEMS } from "../inventory";
import CanvasImage from "../components/canvas_image";

export default class Item extends Component {
    constructor(props) {
        super(props);

        this.handle_click = this.handle_click.bind(this);
    }

    componentDidMount() {}

    handle_click() {
        if (this.props.bubble_event) {
            this.props.bubble_event("pickup_item", this.props.item);
        }
    }

    render() {
        let width = this.props.size;
        let height = this.props.size;

        let details = ITEMS[this.props.item.type];
        let position = this.props.position || [0, 0];

        return (
            <Group x={position[0]} y={position[1]} onClick={this.handle_click}>
                <CanvasImage
                    src={`/static/images/${details["image"]}`}
                    position={[width / 2, height / 2]}
                    size={[width, height]}
                />
                <Text text={`${details["text"]} : ${this.props.item.count}`} fontSize={12} />
            </Group>
        );
    }
}
