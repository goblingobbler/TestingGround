import React, { Component } from "react";

import CanvasMap from "../components/canvas_map";
import GroundLayer from "../layers/ground_layer";
import OreLayer from "../layers/ore_layer";
import PlayerLayer from "../layers/player_layer";

const PLAYER_SPEED = 8;
const SIXTY_FPS = parseInt(1000 / 60);

export default class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            player_position: [0, 0],
            moving_direction: [0, 0],
            moving: false,
        };

        this.start_moving = this.start_moving.bind(this);
        this.move = this.move.bind(this);
        this.stop_moving = this.stop_moving.bind(this);
    }

    start_moving(event) {
        console.log(event.key);

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
            this.setState(
                {
                    moving_direction,
                    moving: true,
                },
                this.move
            );
        }
    }

    move() {
        if (this.state.moving_direction[0] == 0 && this.state.moving_direction[1] == 0) {
            return false;
        }

        let player_position = [
            this.state.player_position[0] + this.state.moving_direction[0],
            this.state.player_position[1] + this.state.moving_direction[1],
        ];

        this.setState(
            { player_position },
            function () {
                setTimeout(this.move, SIXTY_FPS);
            }.bind(this)
        );
    }

    stop_moving(event) {
        console.log(event.key);

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
        return (
            <div onKeyDown={this.start_moving} onKeyUp={this.stop_moving}>
                <CanvasMap is_map_draggable={true} player_position={this.state.player_position}>
                    <GroundLayer player_position={this.state.player_position} />
                    <OreLayer player_position={this.state.player_position} />
                    <PlayerLayer />
                </CanvasMap>
            </div>
        );
    }
}
