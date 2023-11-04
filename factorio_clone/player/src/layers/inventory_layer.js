import React, { Component } from "react";
import { Layer, Group, Rect, Text, Image } from "react-konva";

import { Item } from "../inventory";

class InventorySlot extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        let width = this.props.size;
        let height = this.props.size;

        let item = null;
        if (this.props.item) {
            item = <Item item={this.props.item} size={this.props.size} bubble_event={this.props.bubble_event} />;
        }

        return (
            <Group x={this.props.position[0]} y={this.props.position[1]}>
                <Rect width={width} height={height} stroke={"grey"} />
                {item}
            </Group>
        );
    }
}

export default class Inventory extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {}

    render() {
        let width = this.props.width;
        let height = this.props.height;

        let slots = [];
        let slot_size = width / 2 / 10;
        let row = 0;
        while (row < 4) {
            let col = 0;
            while (col < 10) {
                let index = row * 10 + col;
                let position = [col * slot_size, row * slot_size];
                slots.push(
                    <InventorySlot
                        item={this.props.items[index]}
                        position={position}
                        size={slot_size}
                        bubble_event={this.props.bubble_event}
                    />
                );

                col += 1;
            }
            row += 1;
        }

        return (
            <Layer x={width / 4} y={height / 4}>
                <Group x={0} y={0}>
                    <Rect width={width / 2} height={slot_size * 4} fill={"rgb(200,200,200)"} />
                    <Rect
                        x={-5}
                        y={-5}
                        width={width / 2 + 10}
                        height={slot_size * 4 + 10}
                        stroke={"black"}
                        strokeWidth={10}
                    />

                    {slots}
                </Group>
            </Layer>
        );
    }
}
