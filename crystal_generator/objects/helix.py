import math

from objects.circle import Circle

class Helix():
    def __init__(
            self, 
            radius, 
            point_count=24, 
            angle_start=0, 
            step=.2, 
            height=10, 
            reverse=False,
            ossilation=0, 
            ossilation_steps=48, 
            ossilation_start=math.pi / 2, 
        ):
        self.radius = radius
        self.point_count = point_count
        self.angle_start = angle_start
        self.step = step
        self.height = height
        
        self.reverse = reverse

        self.ossilation = ossilation
        self.ossilation_step = (2 * math.pi) / ossilation_steps
        self.ossilation_start = ossilation_start


    def create_circles(
            self, 
            circle_radius, 
            point_count=24, 
            ossilation=0, 
            ossilation_steps=24, 
            ossilation_start=0, 
            rotation_steps=0,
            rotation_reverse=False,
            eccentricity=0,
            angle_range=None,
        ):

        circles = []

        angle_step = 0
        if self.point_count != 0:
            angle_step = (2 * math.pi) / self.point_count
        ossilation_step = (2 * math.pi) / ossilation_steps
        rotation = 0
        if rotation_steps:
            rotation = (2 * math.pi) / rotation_steps

        angle = self.angle_start
        total_angle = angle
        if angle_range:
            multiplier = math.sin(total_angle)
            diff = (angle_range[1] - angle_range[0]) / 2
            addition = diff * multiplier
            midpoint = (angle_range[1] + angle_range[0])/2
            angle = midpoint + addition

        ossilation_angle = ossilation_start
        helix_ossilation_angle = self.ossilation_start
        circle_starting_angle = 0
        elevation = 0
        
        if self.reverse:
            angle_step = -1 * angle_step
            ossilation_step = -1 * ossilation_step
        if rotation_reverse:
            rotation = -1 * rotation

        while elevation <= self.height:
            
            radius = self.radius + math.sin(helix_ossilation_angle) * self.ossilation
            
            x = radius * math.sin(angle)
            y = radius * math.cos(angle)
            center = [x, y, elevation]

            radius = circle_radius + math.sin(ossilation_angle) * ossilation
            new_circle = Circle(
                center, 
                radius=radius, 
                point_count=point_count, 
                starting_angle=circle_starting_angle,
                eccentricity=eccentricity,
            )
            circles.append(new_circle)

            total_angle += angle_step

            if angle_range:
                multiplier = math.sin(total_angle)

                diff = (angle_range[1] - angle_range[0]) / 2
                addition = diff * multiplier
                midpoint = (angle_range[1] + angle_range[0])/2

                angle = midpoint + addition

            else:
                angle += angle_step

            ossilation_angle += ossilation_step
            helix_ossilation_angle += self.ossilation_step
            elevation += self.step
            circle_starting_angle += rotation

        self.circles = circles

        print('Circles Created', len(self.circles))

    def create_faces(self):
        faces = []
        count = 1

        while count < len(self.circles):
            circle = self.circles[count]
            last_circle = self.circles[count-1]

            for point in range(len(circle.points)):
                faces.append([
                    circle.points[point-1],
                    circle.points[point],
                    last_circle.points[point],
                ])

                faces.append([
                    last_circle.points[point],
                    last_circle.points[point-1],
                    circle.points[point-1],
                ])

            count += 1

        first_circle = self.circles[0]
        for point in range(2, len(first_circle.points)):
            faces.append([
                first_circle.points[point-1],
                first_circle.points[point],
                first_circle.points[0],
            ])

        last_circle = self.circles[len(self.circles) - 1]
        for point in range(2, len(last_circle.points)):
            faces.append([
                last_circle.points[point-1],
                last_circle.points[point],
                last_circle.points[0],
            ])

        self.faces = faces
        print('Faces Created', len(self.faces))









