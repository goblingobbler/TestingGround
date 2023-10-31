
function get_scaled_position(input, map_position, zoom) {
    var position = [
        (input[0] - map_position[0]) / zoom,
        (input[1] - map_position[1]) / zoom,
    ];

    return position;
}

export default get_scaled_position;
