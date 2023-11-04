import React, { Component } from "react";
import { Layer, Group, Rect, Text } from "react-konva";

import CanvasImage from "../components/canvas_image";
import { ITEMS } from "../inventory";
import { get_quadrent_number, get_tile, get_distance } from "../helpers";

function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

class OreTile extends Component {
    constructor(props) {
        super(props);

        this.mine_ore = this.mine_ore.bind(this);
    }

    componentDidMount() {}

    mine_ore() {
        console.log("MINE");
        if (this.props.bubble_event) {
            this.props.bubble_event("mine", {
                key: this.props.text,
                type: this.props.type,
                position: this.props.position,
            });
        }
    }

    render() {
        let width = (-1 * this.props.size) / 2;
        let height = (-1 * this.props.size) / 2;

        return (
            <Group x={this.props.position[0]} y={this.props.position[1]} onClick={this.mine_ore}>
                <CanvasImage
                    src={`/static/images/${ITEMS[this.props.type]["image"]}`}
                    position={[0, 0]}
                    size={[this.props.size, this.props.size]}
                />
                <Text text={this.props.text} fontSize={12} />
            </Group>
        );
    }
}
export default class OreLayer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            deposits: [],
            rejected_tiles: "",
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

        let starting_tile = get_tile(this.props.top_position, tile_size);
        let old_starting_tile = get_tile(old_props.top_position, tile_size);

        if (
            this.props.width != old_props.width ||
            this.props.height != old_props.height ||
            starting_tile[0] != old_starting_tile[0] ||
            starting_tile[1] != old_starting_tile[1]
        ) {
            this.spawn_ore();
            this.update_ore_tiles();
        }
    }

    spawn_ore() {
        let deposits = this.state.deposits;
        let rejected_tiles = this.state.rejected_tiles;

        let tile_size = this.props.tile_size || 50;
        let map_size = get_tile([this.props.width, this.props.height], tile_size, 2);
        let starting_tile = get_tile(this.props.top_position, tile_size, -1);

        let new_deposit = false;

        let row = 0;
        while (row <= map_size[0]) {
            let tile_row = starting_tile[0] + row;

            let col = 0;
            while (col <= map_size[1]) {
                let tile_col = starting_tile[1] + col;

                let tile_key = `${tile_row}_${tile_col}`;
                if (rejected_tiles.includes(tile_key)) {
                    col += 1;
                    continue;
                }

                let valid_tile = true;
                for (let deposit of deposits) {
                    let distance = get_distance([tile_row, tile_col], deposit["center"]);

                    if (distance < 30) {
                        valid_tile = false;
                    }
                }

                if (valid_tile) {
                    let spawn_chance = 5;
                    let spawn_roll = get_random_int(0, 1000);
                    if (spawn_roll <= spawn_chance) {
                        let type = "iron";
                        let deposit = this.generate_node([tile_row, tile_col], type);

                        deposits.push(deposit);
                        new_deposit = true;
                    } else {
                        rejected_tiles += " " + tile_key;
                    }
                } else {
                    rejected_tiles += " " + tile_key;
                }
                col += 1;
            }

            row += 1;
        }

        this.setState({
            deposits: deposits,
            rejected_tiles: rejected_tiles,
        });

        if (new_deposit && this.props.bubble_event) {
            this.props.bubble_event("update_ore", deposits);
        }
    }

    generate_node(center, type) {
        let tile_key = `${center[0]}_${center[1]}`;
        let tiles = [tile_key];

        return {
            tiles: tiles,
            center: center,
            type: type,
        };
    }

    update_ore_tiles() {
        let tile_size = this.props.tile_size || 50;
        let map_size = get_tile([this.props.width, this.props.height], tile_size, 2);
        let starting_tile = get_tile(this.props.top_position, tile_size, -1);

        let row = 0;
        let display_tiles = [];

        while (row < map_size[0]) {
            let tile_row = starting_tile[0] + row;

            let col = 0;
            while (col < map_size[1]) {
                let tile_col = starting_tile[1] + col;

                let tile_key = `${tile_row}_${tile_col}`;
                for (let deposit of this.state.deposits) {
                    if (deposit["tiles"].includes(tile_key)) {
                        let position = [tile_row * tile_size + tile_size / 2, tile_col * tile_size + tile_size / 2];
                        let display_tile = (
                            <OreTile
                                bubble_event={this.props.bubble_event}
                                type={deposit["type"]}
                                deposit={deposit}
                                key={tile_key}
                                text={tile_key}
                                position={position}
                                size={tile_size}
                            />
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
