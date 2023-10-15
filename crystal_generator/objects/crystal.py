import random

from helpers.helpers import area, is_on_edge, calc_color_diff


class Crystal():
    def __init__(self, pixels, crystals, dead_pixels, x, y):
        self.stuck = False
        self.dead = False

        self.pixels = pixels
        self.crystals = crystals

        self.starting_color = pixels[y][x]
        self.starting_point = [x, y]

        self.points = [
            [x-1, y-1],
            [x+1, y],
            [x, y+1],
        ]

        self.stuck_points = [False, False, False]

        self.dead_pixels = dead_pixels

    def is_point(self, point, freeze=False):
        if point[0] == self.points[0][0] and point[1] == self.points[0][1]:
            if freeze:
                self.stuck_points[0] = True
            return True
        if point[0] == self.points[1][0] and point[1] == self.points[1][1]:
            if freeze:
                self.stuck_points[1] = True
            return True
        if point[0] == self.points[2][0] and point[1] == self.points[2][1]:
            if freeze:
                self.stuck_points[2] = True
            return True

        return False

    def is_on_edge(self, point, freeze=False):
        if is_on_edge(self.points[0], self.points[1], point):
            if freeze:
                self.stuck_points[0] = True
                self.stuck_points[1] = True
            return True
        if is_on_edge(self.points[0], self.points[2], point):
            if freeze:
                self.stuck_points[0] = True
                self.stuck_points[2] = True
            return True
        if is_on_edge(self.points[1], self.points[2], point):
            if freeze:
                self.stuck_points[1] = True
                self.stuck_points[2] = True
            return True

        return False

    def is_inside(self, point):
        a = area(self.points)

        if a == 0:
            return False

        a1 = area([
            point,
            self.points[1],
            self.points[2],
        ])

        a2 = area([
            self.points[0],
            point,
            self.points[2],
        ])

        a3 = area([
            self.points[0],
            self.points[1],
            point,
        ])

        return a == (a1 + a2 + a3)

    def overlaps_other_crystals(self, point, freeze=False):
        overlap = False
        for other_crystal in self.crystals:
            if other_crystal.starting_point == self.starting_point:
                continue
            if other_crystal.dead:
                continue
            if other_crystal.is_point(point, freeze):
                continue
            if other_crystal.is_on_edge(point, freeze):
                continue

            if other_crystal.is_inside(point):
                if freeze:
                    other_crystal.stuck = True
                overlap = True
                break

        return overlap

    def grow(self, length=1, color_diff=40):
        if self.stuck:
            return None

        stuck = True
        failure = ''

        indicies = [x for x in range(2)]
        random.shuffle(indicies)
        # Create random list of points to try
        for index in indicies:
            if self.stuck_points[index]:
                continue

            point = self.points[index]

            if self.overlaps_other_crystals(point, freeze=True):
                self.stuck_points[index] = True
                failure += ' other_overlap'
                continue

            stuck = True

            directions = [
                [length, 0],
                [-1 * length, 0],
                [0, length],
                [0, -1 * length],
            ]
            random.shuffle(directions)

            for direction in directions:
                new_point = [
                    point[0] + direction[0],
                    point[1] + direction[1],
                ]

                if new_point[0] >= len(self.pixels[0]) or new_point[1] >= len(self.pixels):
                    failure += ' outside'
                    continue

                if self.dead_pixels[new_point[1]][new_point[0]] == (0,0,0):
                    failure += ' dead_pixel'
                    continue

                if self.is_inside(new_point):
                    failure += ' inside'
                    continue

                if self.overlaps_other_crystals(new_point):
                    failure += ' overlap'
                    continue

                calculated_diff = calc_color_diff(
                    self.pixels[new_point[1]][new_point[0]],
                    self.pixels[self.starting_point[1]][self.starting_point[0]]
                )

                if calculated_diff > color_diff:
                    failure += ' color_diff'
                    continue

                self.points[index] = new_point
                stuck = False
                break

            self.stuck_points[index] = stuck
            if not stuck:
                break

        self.stuck = stuck

        if stuck:
            print('Failure', failure)
            return None

        return True
