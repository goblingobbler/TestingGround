

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

def get_direction_opposites(primary=False):
    if primary:
        return {
            'left': 'right',
            'right': 'left',
            'down': 'up',
            'up': 'down',
        }
    
    else:
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