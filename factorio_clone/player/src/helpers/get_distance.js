export default function get_distance(point_a, point_b) {
    let distance = Math.sqrt(Math.pow(point_a[0] - point_b[0], 2) + Math.pow(point_a[1] - point_b[1], 2), 2);

    return distance;
}
