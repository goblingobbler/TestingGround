export default function get_tile(position, tile_size) {
    return [parseInt(position[0] / tile_size), parseInt(position[1] / tile_size)];
}
