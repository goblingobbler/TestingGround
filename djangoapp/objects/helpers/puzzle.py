import math

from objects.helpers.circle import Circle


class Puzzle:
    def __init__(
        self,
        inner_radius=7.5,
        middle_radius=10,
        outer_radius=15,
        rotation_steps=4,
        vertical_steps=5,
        key_height=5,
        circle_points=24,
    ):
        self.inner_radius=inner_radius
        self.middle_radius=middle_radius
        self.outer_radius=outer_radius

        self.rotation_steps = rotation_steps
        self.vertical_steps = vertical_steps
        self.key_height = key_height

        self.circle_points = circle_points

        self.total_height = self.vertical_steps * self.key_height


    def make_outer_cylinder(self):
        # Define circle edges
        center = [0, 0, 0]
        height = 0

        circles = []
        while height < self.total_height:
            circles.append(Circle(
                center,
                radius=self.outer_radius,
                point_count=self.circle_points,
                starting_angle=0,
            ))

            height += self.key_height
            center[2] = height

        # Combine circles
        faces = []
        count = 1

        while count < len(circles):
            circle = circles[count]
            last_circle = circles[count - 1]

            for point in range(len(circle.points)):
                faces.append(
                    [
                        circle.points[point - 1],
                        circle.points[point],
                        last_circle.points[point],
                    ]
                )

                faces.append(
                    [
                        last_circle.points[point],
                        last_circle.points[point - 1],
                        circle.points[point - 1],
                    ]
                )

            count += 1

        if len(circles) > 0:
            first_circle = circles[0]
            for point in range(2, len(first_circle.points)):
                faces.append(
                    [
                        first_circle.points[point - 1],
                        first_circle.points[point],
                        first_circle.points[0],
                    ]
                )

            last_circle = circles[len(circles) - 1]
            for point in range(2, len(last_circle.points)):
                faces.append(
                    [
                        last_circle.points[point - 1],
                        last_circle.points[point],
                        last_circle.points[0],
                    ]
                )

        self.faces = faces
        print("Faces Created", len(self.faces))

        return self.faces


