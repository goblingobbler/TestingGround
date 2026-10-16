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
        self.height_steps = 5
        self.height_step = self.key_height / self.height_steps

        self.circle_points = circle_points
        self.angle_step = (2 * math.pi) / self.circle_points
        self.points_per_rotation_step = int(self.circle_points / self.rotation_steps)

        self.total_height = self.vertical_steps * self.key_height

        self.middle_row = int(self.height_steps/2)
        self.middle_square = int(self.points_per_rotation_step / 2) * 2 + 1
        self.faces_per_row = self.points_per_rotation_step * 2

        print('Puzzle Config', self.total_height, self.points_per_rotation_step)

    def build_puzzle(self, paths=list()):
        faces = []
        #faces.extend(self.make_outer_cylinder())
        faces.extend(self.make_inner_cylinder(paths))
        #faces.extend(self.make_bottom())
        #faces.extend(self.make_top())

        print("Faces Created", len(faces))

        return faces


    def make_inner_cylinder(self, paths):
        faces = []

        for i in range(self.vertical_steps):
            for j in range(self.rotation_steps):
                segment_type = paths[i][j]
                faces.extend(self.make_segment(i,j, segment_type))

        return faces

    def make_segment(self, i, j, segment_type):
        height = self.key_height * i
        max_height = height + self.key_height
        angle = self.angle_step * self.points_per_rotation_step * j

        faces = self.make_blank_segment(angle, height, max_height)

        if segment_type != 'blank':
            self.remove_center(faces)


        if segment_type == 'up_down_left':
            self.remove_top(faces)
            self.remove_bottom(faces)
            self.remove_left(faces)
        elif segment_type == 'down_left_right':
            self.remove_top(faces)
            self.remove_left(faces)
            self.remove_right(faces)
        elif segment_type == 'up_down_right':
            self.remove_top(faces)
            self.remove_bottom(faces)
            self.remove_right(faces)
        elif segment_type == 'up_left_right':
            self.remove_bottom(faces)
            self.remove_left(faces)
            self.remove_right(faces)
        if segment_type == 'down_left':
            self.remove_top(faces)
            self.remove_left(faces)
        elif segment_type == 'down_right':
            self.remove_top(faces)
            self.remove_right(faces)
        elif segment_type == 'up_left':
            self.remove_bottom(faces)
            self.remove_left(faces)
        elif segment_type == 'up_right':
            self.remove_bottom(faces)
            self.remove_right(faces)
        elif segment_type == 'vertical':
            self.remove_top(faces)
            self.remove_bottom(faces)
        elif segment_type == 'horizontal':
            self.remove_left(faces)
            self.remove_right(faces)
        elif segment_type == 'cross':
            self.remove_top(faces)
            self.remove_bottom(faces)
            self.remove_left(faces)
            self.remove_right(faces)

        return faces

    def segment_rows(self):
        return range(0, self.height_steps)

    def segment_row_squares(self):
        return range(1, self.points_per_rotation_step * 2, 2)

    def remove_center(self, faces):
        for i in self.segment_rows():
            for j in self.segment_row_squares():
                if j == self.middle_square and i == self.middle_row:
                    index = j + i * self.faces_per_row
                    faces[index -1] = None
                    faces[index] = None

        return faces

    def remove_top(self, faces):
        for i in self.segment_rows():
            for j in self.segment_row_squares():
                if j == self.middle_square and i > self.middle_row:
                    index = j + i * self.faces_per_row
                    faces[index -1] = None
                    faces[index] = None

        return faces
    
    def remove_bottom(self, faces):
        for i in self.segment_rows():
            for j in self.segment_row_squares():
                if j == self.middle_square and i < self.middle_row:
                    index = j + i * self.faces_per_row
                    faces[index -1] = None
                    faces[index] = None

        return faces

    def remove_left(self, faces):
        for i in self.segment_rows():
            for j in self.segment_row_squares():
                if j < self.middle_square and i == self.middle_row:
                    index = j + i * self.faces_per_row
                    faces[index -1] = None
                    faces[index] = None

        return faces

    def remove_right(self, faces):
        for i in self.segment_rows():
            for j in self.segment_row_squares():
                if j > self.middle_square and i == self.middle_row:
                    index = j + i * self.faces_per_row
                    faces[index -1] = None
                    faces[index] = None

        return faces
    
    def make_vertical_segment(self, angle, height, max_height):
        faces = self.make_blank_segment(angle, height, max_height)
        self.remove_center(faces)
        self.remove_top(faces)
        self.remove_bottom(faces)
        return faces

    def make_horizontal_segment(self, angle, height, max_height):
        faces = self.make_blank_segment(angle, height, max_height)
        self.remove_center(faces)
        self.remove_left(faces)
        self.remove_right(faces)
        return faces

    def make_cross_segment(self, angle, height, max_height):
        return faces

    
    def make_blank_segment(self, angle, height, max_height):
        faces = []
        while height < max_height:
            for k in range(1, self.points_per_rotation_step + 1):

                faces.extend(self.make_square(
                    [
                        self.inner_radius * math.sin(angle + self.angle_step * (k -1)),
                        self.inner_radius * math.cos(angle + self.angle_step * (k -1)),
                        height
                    ],
                    [
                        self.inner_radius * math.sin(angle + self.angle_step * (k)),
                        self.inner_radius * math.cos(angle + self.angle_step * (k)),
                        height + self.height_step
                    ]
                ))

            height += self.height_step

        return faces

    def make_square(self, start, end):
        faces = []
        
        point_a = start
        point_b = [start[0],start[1], end[2]]
        point_c = [end[0],end[1], start[2]]
        point_d = end

        faces.append(
            [point_a, point_c, point_d]
        )
        faces.append(
            [point_a, point_d, point_b]
        )

        return faces


    def make_outer_cylinder(self):
        # Define circle edges
        center = [0, 0, 0]
        height = 0

        circles = []
        while height <= self.total_height:
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

        return faces

    def make_bottom(self):
        faces = []

        first_circle = Circle(
            [0,0,0],
            radius=self.outer_radius,
            point_count=self.circle_points,
            starting_angle=0,
        )
        
        for point in range(2, len(first_circle.points)):
            faces.append(
                [
                    first_circle.points[point - 1],
                    first_circle.points[point],
                    first_circle.points[0],
                ]
            )

        return faces

    def make_top(self):
        faces = []

        last_circle = Circle(
            [0,0,self.total_height],
            radius=self.outer_radius,
            point_count=self.circle_points,
            starting_angle=0,
        )

        for point in range(2, len(last_circle.points)):
            faces.append(
                [
                    last_circle.points[0],
                    last_circle.points[point],
                    last_circle.points[point - 1],
                ]
            )

        return faces
