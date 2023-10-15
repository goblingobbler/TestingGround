import math
import sys


def area(points):
    a = points[0][0] * (points[1][1] - points[2][1])
    b = points[1][0] * (points[2][1] - points[0][1])
    c = points[2][0] * (points[0][1] - points[1][1])

    area = .5 * abs(a + b + c)

    return area

def is_on_edge(edge1, edge2, point):
    crossproduct = (point[1] - edge1[1]) * (edge2[0] - edge1[0]) - (point[0] - edge1[0]) * (edge2[1] - edge1[1])

    # compare versus epsilon for floating point values, or != 0 if using integers
    if abs(crossproduct) > sys.float_info.epsilon:
        return False

    dotproduct = (point[0] - edge1[0]) * (edge2[0] - edge1[0]) + (point[1] - edge1[1])*(edge2[1] - edge1[1])
    if dotproduct < 0:
        return False

    squaredlengthba = (edge2[0] - edge1[0])*(edge2[0] - edge1[0]) + (edge2[1] - edge1[1])*(edge2[1] - edge1[1])
    if dotproduct > squaredlengthba:
        return False

    return True

def calc_color_diff(a, b):
    distance = math.sqrt(
        math.pow(a[0] - b[0], 2) +
        math.pow(a[1] - b[1], 2) +
        math.pow(a[2] - b[2], 2)
    )

    return distance
