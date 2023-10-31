import React, { Component } from "react";
import { Layer, Group, Rect } from "react-konva";

import CanvasImage from "../components/canvas_image";

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
            <Rect
                x={this.props.position[0]}
                y={this.props.position[1]}
                width={this.props.size}
                height={this.props.size}
                fill={this.props.color || "grey"}
            />
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
    }

    componentDidMount() {
        if (this.props.load_ground_layer) {
            this.props.load_ground_layer(this.layer_node);
        }
    }

    get_quadrent(row, col) {
        let tile_size = this.props.tile_size || 50;

        let tiles = this.state.ground_tiles;
        let offset = [0, 0];
        let quadrent_number = 0;
        if (row < 0) {
            if (col < 0) {
                quadrent_number = 2;
                offset = [1, 1];
            } else {
                quadrent_number = 3;
                offset = [1, 0];
            }
        } else {
            if (col < 0) {
                quadrent_number = 1;
                offset = [0, 1];
            } else {
                quadrent_number = 0;
            }
        }

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

            let r = get_random_int(100, 200);
            let g = get_random_int(100, 200);
            let b = get_random_int(100, 200);
            let color = `rgb(${r}, ${g}, ${b})`;

            quadrent[tile_row].push(
                <GroundTile color={color} key={`${row}_${current_col}`} position={position} size={tile_size} />
            );
        }

        return quadrent[tile_row][tile_col];
    }

    render() {
        let tile_size = this.props.tile_size || 50;
        let rows = parseInt(this.props.width / tile_size);
        let cols = parseInt(this.props.height / tile_size);

        let starting_tile = [
            parseInt(this.props.player_position[0] / tile_size),
            parseInt(this.props.player_position[1] / tile_size),
        ];

        let row = 0;
        let display_tiles = [];

        while (row < rows) {
            let tile_row = starting_tile[0] + row;
            console.log(tile_row);

            let col = 0;
            while (col < cols) {
                let tile_col = starting_tile[1] + col;
                if (tile_row == -1) {
                    console.log("col", tile_col);
                }

                let tile = this.get_quadrent(tile_row, tile_col);

                display_tiles.push(tile);

                col += 1;
            }
            row += 1;
        }

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
                    {display_tiles}
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
                </Group>
            </Layer>
        );
    }
}
