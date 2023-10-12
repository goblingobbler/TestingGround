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

def get_directions_for_distance(distance=1):
    directions = []
    for i in range(-1 * distance, distance+1):
        for j in range(-1 * distance, distance+1):
            if abs(i) + abs(j) == distance:
                directions.append([i,j])
    
    return directions


def get_directions(primary=False, length=1):
    if primary:
        return {
            'left': [length, 0], #left
            'right': [-1 * length, 0], #right
            'down': [0, length], #down
            'up': [0, -1 * length], #up
        }

    else:
        return {
            'left': [length, 0], #left
            'right': [-1 * length, 0], #right
            'down': [0, length], #down
            'up': [0, -1 * length], #up

            'left_down': [length, length], # left_down
            'right_down': [-1 * length, length], # right_down
            'left_up': [length, -1 * length], # left_up
            'right_up': [-1 * length, -1 * length], # right_up
        }

def get_direction_opposites():
    return {
        'left': ['right', 'right_up', 'right_down'],
        'right': ['left', 'left_up', 'left_down'],
        'down': ['up', 'right_up', 'left_up'],
        'up': ['down', 'right_down', 'left_down'],
        
        'left_down': ['right', 'up', 'right_up'],
        'right_down': ['left', 'up', 'left_up'],
        'left_up': ['right', 'down', 'right_down'],
        'right_up': ['left', 'down', 'left_down'],
    }


def get_angles(width, height):
    return {
        'upper_left': [
            range(height),
            range(width)
        ],
        'upper_right': [
            range(height),
            [width - i - 1 for i in range(width)]
        ],
        'lower_left': [
            [height - i - 1 for i in range(height)],
            range(width)
        ],
        'lower_right': [
            [height - i - 1 for i in range(height)],
            [width - i - 1 for i in range(width)]
        ],
    }