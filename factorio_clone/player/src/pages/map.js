import React, { Component } from "react";

import { ITEMS } from "../inventory";

import CanvasMap from "../components/canvas_map";
import GroundLayer from "../layers/ground_layer";
import OreLayer from "../layers/ore_layer";
import BuildingLayer from "../layers/building_layer";
import PlayerLayer from "../layers/player_layer";
import FPSStats from "react-fps-stats";
import Inventory from "../layers/inventory_layer";

import { Layer } from "react-konva";

import { get_tile, get_distance } from "../helpers";

import { Item } from "../inventory";

const PLAYER_SPEED = 12;
const SIXTY_FPS = parseInt(1000 / 60);

const STACK_SIZE = 100;

export default class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tile_size: 50,
            zoom: 1,
            layer_position: [0, 0],
            mouse_position: [0, 0],
            player_position: [window.innerWidth / 2, window.innerHeight / 2],
            moving_direction: [0, 0],
            destination: null,
            moving: false,
            show_inventory: false,

            deposits: [],

            player_inventory: [
                {
                    type: "iron",
                    count: 6,
                },
                {
                    type: "miner",
                    count: 1,
                },
            ],

            held_item: null,
        };

        this.handle_key_down = this.handle_key_down.bind(this);
        this.handle_key_up = this.handle_key_up.bind(this);
        this.handle_mouse_move = this.handle_mouse_move.bind(this);
        this.handle_click = this.handle_click.bind(this);
        this.handle_zoom = this.handle_zoom.bind(this);

        this.bubble_event = this.bubble_event.bind(this);

        this.move_to_destination = this.move_to_destination.bind(this);
        this.start_moving = this.start_moving.bind(this);
        this.move = this.move.bind(this);
        this.stop_moving = this.stop_moving.bind(this);
    }

    handle_key_down(event) {
        if (["w", "a", "s", "d"].includes(event.key)) {
            this.start_moving(event);
        }
    }

    handle_key_up(event) {
        if (["w", "a", "s", "d"].includes(event.key)) {
            this.stop_moving(event);
        } else if (event.key == "i") {
            this.setState({ show_inventory: !this.state.show_inventory });
        } else if (event.key == "Escape") {
            this.setState({
                moving_direction: [0, 0],
                destination: null,
                mining: false,
                show_inventory: false,
                held_item: null,
            });
        }
    }

    handle_mouse_move(event) {
        let mouse_position = [event.clientX, event.clientY];
        this.setState({ mouse_position: mouse_position });
    }

    handle_click(event) {
        if (this.state.show_inventory) {
        } else if (this.state.held_item) {
        } else {
            this.move_to_destination(event);
        }
    }

    handle_zoom(zoom, layer_position) {
        this.setState({
            zoom,
            layer_position,
        });
    }

    get_destination(position) {
        let current_position = this.state.player_position;

        let destination = [
            current_position[0] + (position[0] - window.innerWidth / 2) / this.state.zoom,
            current_position[1] + (position[1] - window.innerHeight / 2) / this.state.zoom,
        ];

        return destination;
    }

    move_to_destination(event) {
        let tile_size = this.state.tile_size;

        let current_position = this.state.player_position;

        let destination = this.get_destination([event.clientX, event.clientY]);

        let current_tile = get_tile(current_position, tile_size);
        let destination_tile = get_tile(destination, tile_size);

        let diff = [current_position[0] - destination[0], current_position[1] - destination[1]];
        let diff_total = Math.abs(diff[0]) + Math.abs(diff[1]);

        let distance = get_distance(current_position, destination);
        if (distance < 10) {
            return false;
        }

        let moving_direction = [-1 * (diff[0] / diff_total) * PLAYER_SPEED, -1 * (diff[1] / diff_total) * PLAYER_SPEED];

        if (!this.state.moving) {
            this.setState(
                {
                    moving_direction,
                    destination: destination,
                    moving: true,
                },
                this.move
            );
        } else {
            this.setState({
                moving_direction,
                destination: destination,
            });
        }
    }

    bubble_event(type, data) {
        if (type == "mine") {
            this.setState(
                { mining: true },
                function () {
                    this.mine_ore(data);
                }.bind(this)
            );
        } else if (type == "pickup_item") {
            this.setState({
                held_item: data,
            });
        } else if (type == "update_ore") {
            this.setState({
                deposits: data,
            });
        }
    }

    mine_ore(data) {
        if (!this.state.mining) {
            return false;
        }

        let current_position = this.state.player_position;
        let destination = data["position"];

        let distance = get_distance(current_position, destination);

        if (distance < this.state.tile_size) {
            let inventory = this.state.player_inventory;
            let found = false;
            for (let item of inventory) {
                if (item["type"] == data["type"]) {
                    item["count"] += 1;
                    found = true;
                }
            }
            if (!found) {
                inventory.push({
                    type: data["type"],
                    count: 1,
                });
            }

            this.setState(
                {
                    player_inventory: inventory,
                },
                function () {
                    setTimeout(
                        function () {
                            this.mine_ore(data);
                        }.bind(this),
                        1000
                    );
                }.bind(this)
            );
        }
    }

    start_moving(event) {
        if (event.isComposing || event.keyCode === 229) {
            return;
        }

        let moving_direction = null;
        if (event.key == "w") {
            moving_direction = [this.state.moving_direction[0], -PLAYER_SPEED];
        } else if (event.key == "a") {
            moving_direction = [-PLAYER_SPEED, this.state.moving_direction[1]];
        } else if (event.key == "s") {
            moving_direction = [this.state.moving_direction[0], PLAYER_SPEED];
        } else if (event.key == "d") {
            moving_direction = [PLAYER_SPEED, this.state.moving_direction[1]];
        }

        if (
            moving_direction &&
            (moving_direction[0] != this.state.moving_direction[0] ||
                moving_direction[1] != this.state.moving_direction[1])
        ) {
            if (!this.state.moving) {
                this.setState(
                    {
                        moving_direction,
                        moving: true,
                    },
                    this.move
                );
            } else {
                this.setState({
                    moving_direction,
                });
            }
        }
    }

    move() {
        if (this.state.moving_direction[0] == 0 && this.state.moving_direction[1] == 0) {
            this.setState({
                moving: false,
            });

            return false;
        }

        let player_position = [
            this.state.player_position[0] + this.state.moving_direction[0],
            this.state.player_position[1] + this.state.moving_direction[1],
        ];

        if (this.state.destination) {
            let current_position = this.state.player_position;
            let distance = get_distance(current_position, this.state.destination);
            if (distance < this.state.tile_size) {
                this.setState({
                    moving: false,
                    moving_direction: [0, 0],
                    destination: null,
                });

                return false;
            }
        }

        this.setState(
            { player_position, mining: false },
            function () {
                setTimeout(this.move, SIXTY_FPS);
            }.bind(this)
        );
    }

    stop_moving(event) {
        let moving_direction = null;
        if (event.key == "w") {
            moving_direction = [this.state.moving_direction[0], 0];
        } else if (event.key == "a") {
            moving_direction = [0, this.state.moving_direction[1]];
        } else if (event.key == "s") {
            moving_direction = [this.state.moving_direction[0], 0];
        } else if (event.key == "d") {
            moving_direction = [0, this.state.moving_direction[1]];
        }

        if (moving_direction) {
            this.setState({ moving_direction: moving_direction });
        }
    }

    render() {
        let tile_size = this.state.tile_size;
        let top_position = [
            this.state.player_position[0] - window.innerWidth / 2,
            this.state.player_position[1] - window.innerHeight / 2,
        ];

        let player_tile = get_tile(top_position, tile_size);

        let inventory = null;
        if (this.state.show_inventory) {
            inventory = (
                <Inventory items={this.state.player_inventory} tile_size={tile_size} bubble_event={this.bubble_event} />
            );
        }

        let held_item = null;
        let ghost_building = null;
        if (this.state.held_item) {
            held_item = (
                <Layer>
                    <Item
                        position={[this.state.mouse_position[0] + 3, this.state.mouse_position[1] + 3]}
                        item={this.state.held_item}
                        size={tile_size}
                    />
                </Layer>
            );

            if (!this.state.show_inventory && ITEMS[this.state.held_item.type]["building_details"]) {
                ghost_building = this.state.held_item;
            }
        }

        return (
            <div onKeyDown={this.handle_key_down} onKeyUp={this.handle_key_up} onMouseMove={this.handle_mouse_move}>
                <CanvasMap
                    zoom_max={1}
                    zoom_min={4}
                    zoom={this.state.zoom}
                    handle_click={this.handle_click}
                    handle_zoom={this.handle_zoom}
                >
                    <GroundLayer
                        tile_size={tile_size}
                        top_position={top_position}
                        zoom={this.state.zoom}
                        layer_position={this.state.layer_position}
                    />
                    <OreLayer
                        tile_size={tile_size}
                        top_position={top_position}
                        bubble_event={this.bubble_event}
                        zoom={this.state.zoom}
                        layer_position={this.state.layer_position}
                    />

                    <BuildingLayer
                        tile_size={tile_size}
                        top_position={top_position}
                        bubble_event={this.bubble_event}
                        zoom={this.state.zoom}
                        layer_position={this.state.layer_position}
                        mouse_position={this.state.mouse_position}
                        ghost_building={ghost_building}
                        deposits={this.state.deposits}
                    />

                    <PlayerLayer zoom={this.state.zoom} />

                    {inventory}

                    {held_item}
                </CanvasMap>

                <div style={{ position: "fixed", top: 0, left: 0 }}>
                    <div
                        style={{ background: "white", marginTop: "50px", padding: "5px" }}
                    >{`${player_tile[0]}, ${player_tile[1]}`}</div>
                    <FPSStats />
                </div>
            </div>
        );
    }
}
