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
        key_size=5,
    ):
        self.inner_radius = inner_radius
        self.middle_radius = middle_radius
        self.outer_radius = outer_radius

        # Number of segments in puzzle
        self.rotation_steps = rotation_steps
        self.vertical_steps = vertical_steps

        self.key_size = key_size
        self.segment_size = self.key_size * 2

        self.steps_to_points = 4

        self.circle_points = self.rotation_steps * self.steps_to_points
        self.angle_step = (2 * math.pi) / self.circle_points

        self.total_height = self.vertical_steps * self.segment_size

        self.segment_kwargs = {
            "inner_radius": self.inner_radius,
            "middle_radius": self.middle_radius,
            "outer_radius": self.outer_radius,
            "segment_size": self.segment_size,
            "angle_per_segment": 2 * math.pi / self.rotation_steps,
            "angle_step": self.angle_step,
            "steps_to_points": self.steps_to_points,
        }

        print("Puzzle Config", self.total_height, self.steps_to_points)

    def build_puzzle(self, paths=list()):
        faces = []
        # faces.extend(self.make_outer_cylinder())
        faces.extend(self.make_inner_cylinder(paths))
        # faces.extend(self.make_bottom())
        # faces.extend(self.make_top())

        print("Faces Created", len(faces))

        return faces

    def make_inner_cylinder(self, paths):
        faces = []

        for j in range(self.vertical_steps):
            for i in range(self.rotation_steps):
                segment_type = paths[j][i]
                print("Make Segment", i, j, segment_type)

                segment = Segment(i, j, segment_type, **self.segment_kwargs)
                faces.extend(segment.make())

        return faces

    def make_outer_cylinder(self):
        # Define circle edges
        center = [0, 0, 0]
        height = 0

        circles = []
        while height <= self.total_height:
            circles.append(
                Circle(
                    center,
                    radius=self.outer_radius,
                    point_count=self.circle_points,
                    starting_angle=0,
                )
            )

            height += self.segment_size
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
            [0, 0, 0],
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
            [0, 0, self.total_height],
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


class Segment:
    def __init__(self, i, j, segment_type, **kwargs):
        self.column = i
        self.row = j
        self.type = segment_type

        for key in kwargs:
            setattr(self, key, kwargs[key])

        self.height_step = self.segment_size / self.steps_to_points
        self.faces_per_row = self.steps_to_points * 2
        self.middle_square = [1, 2]
        self.angle = self.segment_angle()
        self.radial_ratio = self.middle_radius / self.inner_radius

        self.faces = []
        self.side_faces = []

    def segment_points(self):
        return range(self.steps_to_points)

    def segment_angle(self):
        angle = (self.angle_per_segment / 2) + self.column * self.angle_per_segment
        print("segment_angle", self.column, angle)
        return angle

    def make(self):
        height = self.segment_size * self.row
        max_height = height + self.segment_size
        angle = self.angle_step * self.steps_to_points * self.column

        self.faces = self.make_blank_segment(angle, height, max_height)

        if self.type != "blank":
            self.move_center()

        if self.type == "up_down_left":
            self.remove_top()
            self.remove_bottom()
            self.remove_left()
        elif self.type == "down_left_right":
            self.remove_top()
            self.remove_left()
            self.remove_right()
        elif self.type == "up_down_right":
            self.remove_top()
            self.remove_bottom()
            self.remove_right()
        elif self.type == "up_left_right":
            self.remove_bottom()
            self.remove_left()
            self.remove_right()
        if self.type == "down_left":
            self.remove_top()
            self.remove_left()
        elif self.type == "down_right":
            self.remove_top()
            self.remove_right()
        elif self.type == "up_left":
            self.remove_bottom()
            self.remove_left()
        elif self.type == "up_right":
            self.remove_bottom()
            self.remove_right()
        elif self.type == "vertical":
            self.remove_top()
            self.remove_bottom()
        elif self.type == "horizontal":
            self.remove_left()
            self.remove_right()
        elif self.type == "cross":
            self.remove_top()
            self.remove_bottom()
            self.remove_left()
            self.remove_right()
        elif self.type == "center":
            pass

        return self.faces + self.side_faces

    def move_square(self, i, j):
        index = i * self.faces_per_row + j * 2
        print("move_square")

        old_faces = []
        for face in [self.faces[index], self.faces[index + 1]]:
            old_points = []
            for point in face:
                old_points.append({"old": list(point), "new": point})

                point[0] *= self.radial_ratio
                point[1] *= self.radial_ratio

            old_faces.append(old_points)

        return old_faces

    def point_still_in_segment(self, old_point):
        for face in self.faces:
            for point in face:
                if point == old_point:
                    return True

        return False

    def line_is_vertical_or_horizontal(self, point_a, point_b):
        if point_a[2] == point_b[2]:
            return True

        if point_a[0] == point_b[0] and point_a[1] == point_b[1]:
            return True

        return False

    def fill_gaps(self, old_faces):
        print("fill_gaps", len(old_faces))

        for face in old_faces:
            last_index = len(face) - 1
            for index in range(len(face)):
                # if not self.point_still_in_segment(face[index]["old"]):
                #    continue

                print("faceing", index)
                new_square = self.face_rectangle(
                    face[last_index]["new"],
                    face[index]["new"],
                    face[last_index]["old"],
                    face[index]["old"],
                )

                self.side_faces.extend(new_square)

                last_index = index

    def move_center(self):
        print("move_center")
        moved_faces = []
        for i in self.segment_points():
            for j in self.segment_points():
                if j in self.middle_square and i in self.middle_square:
                    moved_faces.extend(self.move_square(i, j))

        self.fill_gaps(moved_faces)

    def remove_top(self):
        for i in self.segment_points():
            for j in self.segment_points():
                if j in self.middle_square and i > max(self.middle_square):
                    self.move_square(i, j)

    def remove_bottom(self):
        for i in self.segment_points():
            for j in self.segment_points():
                if j in self.middle_square and i < min(self.middle_square):
                    self.move_square(i, j)

    def remove_left(self):
        for i in self.segment_points():
            for j in self.segment_points():
                if j < min(self.middle_square) and i in self.middle_square:
                    self.move_square(i, j)

    def remove_right(self):
        for i in self.segment_points():
            for j in self.segment_points():
                if j > max(self.middle_square) and i in self.middle_square:
                    self.move_square(i, j)

    def make_blank_segment(self, angle, height, max_height):
        faces = []
        while height < max_height:
            for k in range(1, self.steps_to_points + 1):

                faces.extend(
                    self.make_square(
                        [
                            self.inner_radius
                            * math.sin(angle + self.angle_step * (k - 1)),
                            self.inner_radius
                            * math.cos(angle + self.angle_step * (k - 1)),
                            height,
                        ],
                        [
                            self.inner_radius * math.sin(angle + self.angle_step * (k)),
                            self.inner_radius * math.cos(angle + self.angle_step * (k)),
                            height + self.height_step,
                        ],
                    )
                )

            height += self.height_step

        return faces

    def make_square(self, start, end):
        faces = []

        point_a = start
        point_b = [start[0], start[1], end[2]]
        point_c = [end[0], end[1], start[2]]
        point_d = end
        return self.face_rectangle(point_a, point_b, point_c, point_d)

    def face_rectangle(self, a, b, c, d):
        faces = []

        faces.append([list(a), list(c), list(d)])
        faces.append([list(a), list(d), list(b)])

        return faces
