export default function get_quadrent_number(row, col) {
    let quadrent_number = 0;
    let offset = [0, 0];

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

    return quadrent_number;
}
