import math

class Circle():
    def __init__(self, center, radius, point_count=24, starting_angle=0):
        self.center = center
        self.radius = radius
        self.point_count = point_count
        self.starting_angle = starting_angle

        self.points = self.create_points()


    def create_points(self):
        points = []

        angle_step = (2 * math.pi) / self.point_count
        angle = self.starting_angle
        
        while angle < 2 * math.pi + self.starting_angle and len(points) < self.point_count:

            x = self.radius * math.sin(angle)
            y = self.radius * math.cos(angle)

            new_point = [self.center[0] + x, self.center[1] + y, self.center[2]]

            points.append(new_point)

            angle += angle_step

        print('Circle points created', len(points))

        return points