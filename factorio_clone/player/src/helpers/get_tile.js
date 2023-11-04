export default function get_tile(position, tile_size, adjust = 0) {
    let tile = [parseInt(position[0] / tile_size) + adjust, parseInt(position[1] / tile_size) + adjust];

    return tile;
}
