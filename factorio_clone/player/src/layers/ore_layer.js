import React, { Component } from "react";
import { Layer, Group, Rect, Text } from "react-konva";

import CanvasImage from "../components/canvas_image";
import { get_quadrent_number, get_tile } from "../helpers";

function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

class OreTile extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        return (
            <Group x={this.props.position[0]} y={this.props.position[1]}>
                <Rect width={this.props.size} height={this.props.size} fill={"black"} />
                {/*<Text text={this.props.text} fontSize={12} />*/}
            </Group>
        );
    }
}
export default class OreLayer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            deposits: [],
        };

        this.spawn_ore = this.spawn_ore.bind(this);
        this.update_ore_tiles = this.update_ore_tiles.bind(this);
    }

    componentDidMount() {
        this.spawn_ore();

        this.update_ore_tiles();
    }

    componentDidUpdate(old_props) {
        let tile_size = this.props.tile_size || 50;

        let starting_tile = [
            parseInt(this.props.player_position[0] / tile_size),
            parseInt(this.props.player_position[1] / tile_size),
        ];
        let old_starting_tile = [
            parseInt(old_props.player_position[0] / tile_size),
            parseInt(old_props.player_position[1] / tile_size),
        ];

        if (
            this.props.width != old_props.width ||
            this.props.height != old_props.height ||
            starting_tile[0] != old_starting_tile[0] ||
            starting_tile[1] != old_starting_tile[1]
        ) {
            this.update_ore_tiles();
        }
    }

    spawn_ore() {
        let deposits = this.state.deposits;

        let tiles = ["0_0", "0_1", "0_2", "0_3", "0_4"];
        deposits.push({
            tiles: tiles,
        });

        this.setState({
            deposits: deposits,
        });
    }

    update_ore_tiles() {
        let tile_size = this.props.tile_size || 50;
        let rows = parseInt(this.props.width / tile_size);
        let cols = parseInt(this.props.height / tile_size);

        let starting_tile = get_tile(this.props.player_position, tile_size);

        let row = 0;
        let display_tiles = [];

        while (row < rows) {
            let tile_row = starting_tile[0] + row;

            let col = 0;
            while (col < cols) {
                let tile_col = starting_tile[1] + col;

                let tile_key = `${tile_row}_${tile_col}`;
                for (let deposit of this.state.deposits) {
                    if (deposit["tiles"].includes(tile_key)) {
                        let position = [tile_row * tile_size, tile_col * tile_size];
                        let display_tile = (
                            <OreTile deposit={deposit} key={tile_key} position={position} size={tile_size} />
                        );
                        display_tiles.push(display_tile);
                    }
                }
                col += 1;
            }
            row += 1;
        }

        this.setState({
            display_tiles: display_tiles,
        });
    }

    render() {
        return (
            <Layer
                x={-1 * this.props.player_position[0] * this.props.zoom}
                y={-1 * this.props.player_position[1] * this.props.zoom}
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
