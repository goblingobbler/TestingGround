def make_face(a, b, c, z, reverse=False):
    face = [
        [a[0], a[1], z[0]],
        [b[0], b[1], z[1]],
        [c[0], c[1], z[2]],
    ]

    if reverse:
        face.reverse()

    return face
