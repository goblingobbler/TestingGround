import math


def deg_to_rad(deg):
    return deg * (math.pi / 180)


def rad_to_deg(rad):
    return rad * (180 / math.pi)


def euclidain(a, b):
    return math.sqrt(math.pow(a[0] - b[0], 2) + math.pow(a[1] - b[1], 2))


def find_circle(x1, y1, x2, y2, x3, y3):
    x12 = x1 - x2
    x13 = x1 - x3

    y12 = y1 - y2
    y13 = y1 - y3

    y31 = y3 - y1
    y21 = y2 - y1

    x31 = x3 - x1
    x21 = x2 - x1

    # x1^2 - x3^2
    sx13 = math.pow(x1, 2) - math.pow(x3, 2)

    # y1^2 - y3^2
    sy13 = math.pow(y1, 2) - math.pow(y3, 2)

    sx21 = math.pow(x2, 2) - math.pow(x1, 2)
    sy21 = math.pow(y2, 2) - math.pow(y1, 2)

    f = ((sx13) * (x12) + (sy13) * (x12) + (sx21) * (x13) + (sy21) * (x13)) / (
        2 * ((y31) * (x12) - (y21) * (x13))
    )

    g = ((sx13) * (y12) + (sy13) * (y12) + (sx21) * (y13) + (sy21) * (y13)) / (
        2 * ((x31) * (y12) - (x21) * (y13))
    )

    c = -math.pow(x1, 2) - math.pow(y1, 2) - 2 * g * x1 - 2 * f * y1

    # eqn of circle be x^2 + y^2 + 2*g*x + 2*f*y + c = 0
    # where centre is (h = -g, k = -f) and
    # radius r as r^2 = h^2 + k^2 - c
    h = -g
    k = -f
    sqr_of_r = h * h + k * k - c

    # r is the radius
    r = math.sqrt(sqr_of_r)

    # print("Centre = (", h, ", ", k, ")");
    # print("Radius = ", r);

    return [h, k], r
