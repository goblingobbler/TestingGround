import React, { Component } from "react";
import { Layer, Group, Rect, Text } from "react-konva";

import CanvasImage from "../components/canvas_image";
import { get_quadrent_number, get_tile } from "../helpers";

function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

class GroundTile extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        return (
            <Group x={this.props.position[0]} y={this.props.position[1]}>
                <Rect width={this.props.size + 1} height={this.props.size + 1} fill={this.props.color || "grey"} />
                {/*<Text text={this.props.text} fontSize={12} />*/}
            </Group>
        );
    }
}
export default class GroundLayer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ground_tiles: [[], [], [], []],
        };

        this.get_quadrent = this.get_quadrent.bind(this);
        this.update_ground_tiles = this.update_ground_tiles.bind(this);
    }

    componentDidMount() {
        this.update_ground_tiles();
    }

    componentDidUpdate(old_props) {
        let tile_size = this.props.tile_size || 50;

        let starting_tile = get_tile(this.props.top_position, tile_size);
        let old_starting_tile = get_tile(old_props.top_position, tile_size);

        if (
            this.props.width != old_props.width ||
            this.props.height != old_props.height ||
            starting_tile[0] != old_starting_tile[0] ||
            starting_tile[1] != old_starting_tile[1]
        ) {
            this.update_ground_tiles();
        }
    }

    update_ground_tiles() {
        let tile_size = this.props.tile_size || 50;

        let map_size = get_tile([this.props.width, this.props.height], tile_size, 2);
        let starting_tile = get_tile(this.props.top_position, tile_size, -1);

        let row = 0;
        let display_tiles = [];

        while (row <= map_size[0]) {
            let tile_row = starting_tile[0] + row;

            let col = 0;
            while (col <= map_size[1]) {
                let tile_col = starting_tile[1] + col;

                let tile = this.get_quadrent(tile_row, tile_col);

                let display_tile = (
                    <GroundTile
                        color={tile["color"]}
                        key={tile["key"]}
                        text={tile["key"]}
                        position={tile["position"]}
                        size={tile_size}
                    />
                );
                display_tiles.push(display_tile);

                col += 1;
            }
            row += 1;
        }

        this.setState({
            display_tiles: display_tiles,
        });
    }

    get_quadrent(row, col) {
        let tile_size = this.props.tile_size || 50;

        let tiles = this.state.ground_tiles;
        let quadrent_number = get_quadrent_number(row, col);

        let quadrent = tiles[quadrent_number];

        let tile_row = row;
        let tile_col = col;
        if (row < 0) {
            tile_row = -1 * row - 1;
        }
        if (col < 0) {
            tile_col = -1 * col - 1;
        }

        while (quadrent.length < tile_row + 1) {
            quadrent.push([]);
        }

        while (quadrent[tile_row].length < tile_col + 1) {
            let current_col = quadrent[tile_row].length;
            if (col < 0) {
                current_col = (current_col + 1) * -1;
            }

            let position = [row * tile_size, current_col * tile_size];
            let type = "grass";
            if (quadrent_number == 3) {
                type = "desert";
            } else if (quadrent_number == 2) {
                type = "rock";
            }
            let color = this.get_color(type);

            quadrent[tile_row].push({
                type: type,
                color: color,
                key: `${row}_${current_col}`,
                position: position,
            });
        }

        return quadrent[tile_row][tile_col];
    }

    get_color(type) {
        let color = "grey";

        if (type == "grass") {
            let r = get_random_int(120, 130);
            let g = get_random_int(140, 160);
            let b = get_random_int(120, 130);
            color = `rgb(${r}, ${g}, ${b})`;
        } else if (type == "desert") {
            let r = get_random_int(180, 200);
            let g = get_random_int(180, 200);
            let b = get_random_int(150, 160);
            color = `rgb(${r}, ${g}, ${b})`;
        } else if (type == "rock") {
            let r = get_random_int(150, 160);
            let g = get_random_int(150, 160);
            let b = get_random_int(150, 160);
            color = `rgb(${r}, ${g}, ${b})`;
        }

        return color;
    }

    render() {
        return (
            <Layer
                x={-1 * this.props.top_position[0] * this.props.zoom}
                y={-1 * this.props.top_position[1] * this.props.zoom}
            >
                <Group
                    x={this.props.layer_position[0]}
                    y={this.props.layer_position[1]}
                    scaleX={this.props.zoom}
                    scaleY={this.props.zoom}
                >
                    {this.state.display_tiles}
                </Group>
            </Layer>
        );
    }
}
