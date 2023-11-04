import React, { Component } from "react";
import { Layer, Group, Rect, Text } from "react-konva";

import CanvasImage from "../components/canvas_image";
import { ITEMS } from "../inventory";
import { get_quadrent_number, get_tile, get_distance } from "../helpers";

class Building extends Component {
    constructor(props) {
        super(props);

        this.handle_click = this.handle_click.bind(this);
    }

    componentDidMount() {}

    handle_click() {
        console.log("Click Building");
        if (this.props.bubble_event) {
        }
    }

    render() {
        let building = this.props.details;
        let tile_size = this.props.tile_size || 50;
        let details = ITEMS[building.type];
        let position = building.position;

        let building_size = [
            tile_size * details["building_details"]["size"][0],
            tile_size * details["building_details"]["size"][1],
        ];

        return (
            <Group x={position[0] - (position[0] % tile_size)} y={position[1] - (position[1] % tile_size)}>
                <CanvasImage
                    src={`/static/images/${details["image"]}`}
                    position={[0, 0]}
                    size={building_size}
                    opacity={1}
                />
            </Group>
        );
    }
}

class GhostBuilding extends Component {
    constructor(props) {
        super(props);

        this.handle_click = this.handle_click.bind(this);
    }

    handle_click() {
        let tile_size = this.props.size || 50;

        let tiles = "";
        let keys = [];
        let tile = get_tile(this.props.position, tile_size);
        for (let dir of [
            [0, 0],
            [-1, 0],
            [0, -1],
            [-1, -1],
        ]) {
            let tile_key = `${tile[0] + dir[0]}_${tile[1] + dir[1]}`;
            keys.push(tile_key);
            tiles += `:${tile_key}`;
        }

        let deposits = [];
        for (let key of keys) {
            for (let deposit of this.props.deposits) {
                if (deposit["tiles"].includes(key)) {
                    deposits.push(deposit);
                    break;
                }
            }
        }

        console.log("Click Building");
        let data = {
            type: this.props.building.type,
            position: this.props.position,
            inventory: {},
            deposits: deposits,
            tiles: tiles,
        };
        this.props.place_building(data);
    }

    render() {
        let tile_size = this.props.size || 50;
        let details = ITEMS[this.props.building.type];
        let position = this.props.position;

        let building_size = [
            tile_size * details["building_details"]["size"][0],
            tile_size * details["building_details"]["size"][1],
        ];

        let tile = get_tile(position, tile_size);

        return (
            <Group x={tile[0] * tile_size} y={tile[1] * tile_size} onClick={this.handle_click}>
                <Rect
                    width={building_size[0]}
                    height={building_size[1]}
                    x={(-1 * building_size[0]) / 2}
                    y={(-1 * building_size[1]) / 2}
                    fill={"green"}
                    opacity={0.2}
                />
                <CanvasImage
                    src={`/static/images/${details["image"]}`}
                    position={[0, 0]}
                    size={building_size}
                    opacity={0.5}
                />
                <Text text={`${details["text"]} : ${this.props.building.count}`} fontSize={12} />
            </Group>
        );
    }
}

export default class BuildingLayer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            buildings: [],
        };

        this.update_buildings = this.update_buildings.bind(this);
        this.place_building = this.place_building.bind(this);
    }

    componentDidMount() {
        this.update_buildings();
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
            this.update_buildings();
        }
    }

    update_buildings() {
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
                for (let building of this.state.buildings) {
                    if (building["tiles"].includes(tile_key)) {
                        let display_tile = (
                            <Building bubble_event={this.props.bubble_event} details={building} size={tile_size} />
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

    place_building(building) {
        let buildings = this.state.buildings;
        buildings.push(building);
        this.setState(
            {
                buildings,
            },
            this.update_buildings
        );

        if (this.props.bubble_event) {
            this.props.bubble_event("update_buildings", buildings);
        }
    }

    render() {
        let tile_size = this.props.tile_size || 50;

        let ghost_building = null;
        if (this.props.ghost_building) {
            let position = [
                this.props.top_position[0] +
                    this.props.width / 2 +
                    (this.props.mouse_position[0] - this.props.width / 2) / this.props.zoom,
                this.props.top_position[1] +
                    this.props.height / 2 +
                    (this.props.mouse_position[1] - this.props.height / 2) / this.props.zoom,
            ];

            ghost_building = (
                <GhostBuilding
                    tile_size={tile_size}
                    building={this.props.ghost_building}
                    position={position}
                    place_building={this.place_building}
                    deposits={this.props.deposits}
                />
            );
        }

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
                    {ghost_building}
                </Group>
            </Layer>
        );
    }
}
