import math

class Circle():
    def __init__(self, center, radius, point_count=24, starting_angle=0, eccentricity=0):
        self.center = center
        self.radius = radius
        self.point_count = point_count
        self.starting_angle = starting_angle
        self.eccentricity = eccentricity

        self.points = self.create_points()


    def create_points(self):
        points = []

        angle_step = (2 * math.pi) / self.point_count
        angle = self.starting_angle
        
        count = 0
        while angle < 2 * math.pi + self.starting_angle and len(points) < self.point_count:
            if count % 2 == 0:
                radius = self.radius + self.eccentricity
            else:
                radius = self.radius - self.eccentricity

            x = radius * math.sin(angle)
            y = radius * math.cos(angle)

            new_point = [self.center[0] + x, self.center[1] + y, self.center[2]]

            points.append(new_point)

            angle += angle_step
            count += 1

        print('Circle points created', len(points))

        return points