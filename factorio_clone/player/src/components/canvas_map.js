import React, { Component } from "react";
import { Stage, Layer, Line, Rect, Group, Shape, Text } from "react-konva";

import { is_right_click, get_scaled_position } from "../helpers";

import CanvasImage from "./canvas_image.js";

const zoom_multiplier = 1.1;

export default class CanvasMap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
            map_center: [0, 0],
            top_layer_position: [0, 0],
            layer_position: [0, 0],
            mouse_position: [0, 0],

            image_width: 0,
            image_height: 0,

            zoom: 1,
            zoom_control: 0,

            start_draw_position: null,
            end_draw_position: null,
        };

        this.handle_key_press = this.handle_key_press.bind(this);
        this.handle_scroll = this.handle_scroll.bind(this);

        this.zoom_in = this.zoom_in.bind(this);
        this.zoom_out = this.zoom_out.bind(this);

        this.map_reference = React.createRef();

        this.update_size = this.update_size.bind(this);
    }

    componentDidMount() {
        this.update_size();
    }

    update_size() {
        var ref_bounding = this.map_reference.current.getBoundingClientRect();

        var width = ref_bounding.width;
        var height = window.innerHeight - ref_bounding.top - 5;

        var map_center = [width / 2, height / 2];

        if (this.state.width != width || this.state.height != height) {
            this.setState({
                width: width,
                height: height,
                map_center: map_center,
            });
        }
    }

    handle_key_press(event) {
        if (event.key == "=" || event.key == "+") {
            this.zoom_in();
        } else if (event.key == "-" || event.key == "_") {
            this.zoom_out();
        } else if (this.props.handle_key_press) {
            this.props.handle_key_press(event);
        }
    }

    handle_scroll(e) {
        //var delta = e.nativeEvent.wheelDelta;
        var delta = e.deltaY;

        if (delta < 0) {
            this.zoom_in();
        } else {
            this.zoom_out();
        }
    }

    zoom_in() {
        var zoom = this.state.zoom;
        var original_zoom = zoom;
        zoom *= zoom_multiplier;
        //if (zoom > 2.5){zoom -= .05;}

        this.keep_viewport_centered(original_zoom, zoom);
    }

    zoom_out() {
        var zoom = this.state.zoom;
        var original_zoom = zoom;
        zoom /= zoom_multiplier;
        //if (zoom < .15){zoom += .05;}

        this.keep_viewport_centered(original_zoom, zoom);
    }

    keep_viewport_centered(start_zoom, end_zoom) {
        var map_width = this.state.width;
        var position = this.state.layer_position;

        var new_center_position_on_map_x = (map_width / 2) * end_zoom;
        var new_center_position_on_map_y = (this.state.height / 2) * end_zoom;

        position[0] = this.state.map_center[0] - new_center_position_on_map_x;
        position[1] = this.state.map_center[1] - new_center_position_on_map_y;

        this.setState({
            zoom: end_zoom,
            layer_position: position,
        });
    }

    render() {
        var map_style = {
            outline: "none",
            cursor: this.props.cursor_style || "default",
        };

        const children_with_props = React.Children.map(this.props.children, (child) => {
            // Checking isValidElement is the safe way and avoids a
            // typescript error too.
            if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                    width: this.state.width,
                    height: this.state.height,
                    zoom: this.state.zoom,
                    layer_position: this.state.layer_position,

                    load_ground_layer: this.load_ground_layer,
                });
            }
            return child;
        });

        return (
            <div
                ref={this.map_reference}
                style={map_style}
                onWheel={this.handle_scroll}
                onKeyDown={this.handle_key_press}
                tabIndex="0"
            >
                <Stage
                    width={this.state.width}
                    height={this.state.height}
                    ref={(node) => {
                        this.stageRef = node;
                    }}
                >
                    {children_with_props}
                </Stage>
            </div>
        );
    }
}
