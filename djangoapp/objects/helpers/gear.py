import dis
import math
from PIL import Image, ImageDraw

from objects.helpers.geometry import (
    deg_to_rad,
    find_circle,
    euclidain,
    get_middle_point,
    get_closest_point,
)
from objects.helpers.mesh import make_face

IMAGE_SCALE = 2000

PRESSURE_ANGLE = 20  # Degrees

# https://geargenerator.com/

GEAR_SIDE_POINTS = 30
GEAR_TIP_POINTS = 10
GEAR_INSIDE_POINTS = 20


class Gear:
    def __init__(
        self,
        teeth=10,
        module=1,
        width=2,
        xy_inset=0,
        z_inset=0,
        shaft_width=2,
    ):
        self.teeth = teeth
        self.module = module
        self.width = width
        self.xy_inset = xy_inset
        self.z_inset = z_inset
        self.shaft_width = shaft_width

        # print("chamfer", self.xy_inset, self.z_inset)

        self.teeth_angle = (2 * math.pi) / self.teeth

        self.pitch = self.module * math.pi
        self.pressure_angle = deg_to_rad(PRESSURE_ANGLE)

        self.radius = self.teeth * self.module / 2

        self.addendum = 1.0 * self.module
        self.dedendum = 1.25 * self.module
        self.tooth_depth = 2.25 * self.module

        self.working_depth = 2.0 * self.module
        self.root_clearance = 0.25 * self.module

        self.fillet_radius = 0.38 * self.module

        self.base_radius = self.radius * math.cos(self.pressure_angle)
        self.tip_radius = self.radius + self.addendum
        self.involute_radius = self.radius - self.addendum

        self.root_radius = self.radius - self.dedendum

        # print(self.tip_radius, self.radius, self.base_radius, self.root_radius)

    def build(self):
        points = self.gear_points()
        scaled_points = []
        center_point = self.get_center_point(points)

        center_points = [
            [self.shaft_width / 2, self.shaft_width / 2],
            [self.shaft_width / 2, -1 * self.shaft_width / 2],
            [-1 * self.shaft_width / 2, -1 * self.shaft_width / 2],
            [-1 * self.shaft_width / 2, self.shaft_width / 2],
        ]

        gear_points = self.scale_about_point(
            points[GEAR_INSIDE_POINTS : len(points) - GEAR_INSIDE_POINTS],
            center_point,
            inset=self.xy_inset,
        )
        first_fillet = self.scale_about_point(
            points[0:GEAR_INSIDE_POINTS],
            [0, 0],
            center_point,
            inset=self.xy_inset,
        )
        second_fillet = self.scale_about_point(
            points[len(points) - GEAR_INSIDE_POINTS :],
            center_point,
            [0, 0],
            inset=self.xy_inset,
        )

        faces = self.make_gear_faces(
            first_fillet,
            gear_points,
            second_fillet,
            z_position=self.width / 2,
            center_points=center_points,
        )
        second_faces = self.make_gear_faces(
            first_fillet,
            gear_points,
            second_fillet,
            z_position=-1 * self.width / 2,
            reverse=True,
            center_points=center_points,
        )
        faces.extend(second_faces)

        scaled_points = first_fillet + gear_points + second_fillet

        faces.extend(
            self.bridge_gear_faces(
                points,
                self.width / 2 - self.z_inset,
                points,
                -1 * self.width / 2 + self.z_inset,
            )
        )
        faces.extend(
            self.bridge_gear_faces(
                scaled_points, self.width / 2, points, self.width / 2 - self.z_inset
            )
        )
        faces.extend(
            self.bridge_gear_faces(
                points,
                -1 * self.width / 2 + self.z_inset,
                scaled_points,
                -1 * self.width / 2,
            )
        )

        print(center_points)
        last_point = center_points[-1]
        for point in center_points:
            faces.extend(
                self.bridge_faces(
                    last_point,
                    last_point,
                    point,
                    point,
                    self.width / 2,
                    -1 * self.width / 2,
                )
            )

            last_point = point

        return faces

    def get_center_point(self, points):
        center = [0, 0]
        for point in points:
            center[0] += point[0]
            center[1] += point[1]

        center[0] = center[0] / len(points)
        center[1] = center[1] / len(points)

        return center

    def scale_about_point(self, points, center, final=None, inset=0):
        working_center = [center[0], center[1]]

        scaled_points = []
        avg_diff = [0, 0]

        step = [0, 0]
        if final:
            center_diff = [
                center[0] - final[0],
                center[1] - final[1],
            ]
            step = [
                center_diff[0] / (len(points) - 1),
                center_diff[1] / (len(points) - 1),
            ]

        for point in points:
            working_inset = inset
            diff = [point[0] - working_center[0], point[1] - working_center[1]]

            distance = euclidain([0, 0], diff)
            if working_inset > distance:
                working_inset = distance

            scale_amount = [
                diff[0] * (working_inset / distance),
                diff[1] * (working_inset / distance),
            ]

            avg_diff[0] += abs(scale_amount[0])
            avg_diff[1] += abs(scale_amount[1])

            scaled_points.append(
                [
                    point[0] - scale_amount[0],
                    point[1] - scale_amount[1],
                ]
            )

            working_center[0] -= step[0]
            working_center[1] -= step[1]

        avg_diff[0] = avg_diff[0] / len(points)
        avg_diff[1] = avg_diff[1] / len(points)
        chamfer_offset = euclidain([0, 0], avg_diff)

        return scaled_points

    def bridge_gear_faces(self, top_points, top_z, bottom_points, bottom_z):
        faces = []
        last_top_point = None
        last_bottom_point = None

        for i in range(self.teeth):

            if last_top_point:
                first_top_point = self.rotate(top_points[0], self.teeth_angle * i)
                first_bottom_point = self.rotate(bottom_points[0], self.teeth_angle * i)

                faces.extend(
                    self.bridge_faces(
                        last_top_point,
                        last_bottom_point,
                        first_bottom_point,
                        first_top_point,
                        top_z,
                        bottom_z,
                    )
                )

            else:
                very_first_top_point = self.rotate(top_points[0], self.teeth_angle * i)
                very_first_bottom_point = self.rotate(
                    bottom_points[0], self.teeth_angle * i
                )

            last_top_point = None
            last_bottom_point = None

            for j in range(len(top_points)):
                new_top_point = self.rotate(top_points[j], self.teeth_angle * i)
                new_bottom_point = self.rotate(bottom_points[j], self.teeth_angle * i)

                if last_top_point:
                    faces.extend(
                        self.bridge_faces(
                            last_top_point,
                            last_bottom_point,
                            new_bottom_point,
                            new_top_point,
                            top_z,
                            bottom_z,
                        )
                    )

                last_top_point = new_top_point
                last_bottom_point = new_bottom_point

        first_top_point = very_first_top_point
        first_bottom_point = very_first_bottom_point

        new_face = make_face(
            last_top_point,
            last_bottom_point,
            first_bottom_point,
            [top_z, bottom_z, bottom_z],
        )
        faces.append(new_face)

        new_face = make_face(
            first_bottom_point,
            first_top_point,
            last_top_point,
            [bottom_z, top_z, top_z],
        )
        faces.append(new_face)

        return faces

    def bridge_faces(self, a, b, c, d, top_z, bottom_z):
        faces = []

        new_face = make_face(
            a,
            b,
            c,
            [top_z, bottom_z, bottom_z],
        )
        faces.append(new_face)

        new_face = make_face(
            c,
            d,
            a,
            [bottom_z, top_z, top_z],
        )
        faces.append(new_face)

        return faces

    def make_gear_faces(
        self,
        first_fillet,
        gear_points,
        second_fillet,
        z_position=0,
        reverse=False,
        center_points=[[0, 0]],
    ):
        working_points = [first_fillet[-1]] + gear_points[:] + [second_fillet[0]]
        middle_point = get_middle_point(gear_points[0], gear_points[-1])

        low_middle_point = get_middle_point(first_fillet[0], second_fillet[-1])
        high_middle_point = get_middle_point(first_fillet[-1], second_fillet[0])
        fillet_middle_point = get_middle_point(low_middle_point, high_middle_point)

        faces = []
        inner_points = []
        for i in range(self.teeth):
            inner_points.append(self.rotate(first_fillet[0], self.teeth_angle * i))
            inner_points.append(self.rotate(second_fillet[-1], self.teeth_angle * i))

            last_point = None
            base_point = self.rotate(middle_point, self.teeth_angle * i)
            for point in working_points:
                new_point = self.rotate(point, self.teeth_angle * i)

                if last_point:
                    new_face = make_face(
                        base_point,
                        last_point,
                        new_point,
                        [z_position, z_position, z_position],
                        reverse,
                    )
                    faces.append(new_face)

                last_point = new_point

            new_face = make_face(
                base_point,
                self.rotate(working_points[-1], self.teeth_angle * i),
                self.rotate(working_points[0], self.teeth_angle * i),
                [z_position, z_position, z_position],
                reverse,
            )
            faces.append(new_face)

            last_point = None
            base_point = self.rotate(low_middle_point, self.teeth_angle * i)
            for point in first_fillet[0:4] + second_fillet[-4:]:
                new_point = self.rotate(point, self.teeth_angle * i)

                if last_point:
                    new_face = make_face(
                        base_point,
                        last_point,
                        new_point,
                        [z_position, z_position, z_position],
                        reverse,
                    )
                    faces.append(new_face)

                last_point = new_point

            last_point = self.rotate(second_fillet[-4], self.teeth_angle * i)
            base_point = self.rotate(fillet_middle_point, self.teeth_angle * i)
            for point in first_fillet[3:-4] + second_fillet[4:-3]:
                new_point = self.rotate(point, self.teeth_angle * i)

                if last_point:
                    new_face = make_face(
                        base_point,
                        last_point,
                        new_point,
                        [z_position, z_position, z_position],
                        reverse,
                    )
                    faces.append(new_face)

                last_point = new_point

            last_point = None
            base_point = self.rotate(high_middle_point, self.teeth_angle * i)
            for point in first_fillet[-5:] + second_fillet[0:5]:
                new_point = self.rotate(point, self.teeth_angle * i)

                if last_point:
                    new_face = make_face(
                        base_point,
                        last_point,
                        new_point,
                        [z_position, z_position, z_position],
                        reverse,
                    )
                    faces.append(new_face)

                last_point = new_point

            new_face = make_face(
                self.rotate(high_middle_point, self.teeth_angle * i),
                self.rotate(second_fillet[4], self.teeth_angle * i),
                self.rotate(first_fillet[-5], self.teeth_angle * i),
                [z_position, z_position, z_position],
                reverse,
            )
            faces.append(new_face)

        last_point = inner_points[-1]
        last_closest_point = None
        for point in inner_points:
            closest_point = get_closest_point(point, center_points)
            if last_point:
                new_face = make_face(
                    last_point,
                    point,
                    closest_point,
                    [z_position, z_position, z_position],
                    reverse,
                )
                faces.append(new_face)

            if last_closest_point and last_closest_point != closest_point:
                new_face = make_face(
                    closest_point,
                    last_closest_point,
                    last_point,
                    [z_position, z_position, z_position],
                    reverse,
                )
                faces.append(new_face)

            last_point = point
            last_closest_point = closest_point

        return faces

    def gear_points(self):
        radius = self.involute_radius
        if radius < self.base_radius:
            radius = self.base_radius

        diff = self.tip_radius - radius
        step = diff / GEAR_SIDE_POINTS

        # Involute Curve Points
        contact_points = []
        inverted_contact_points = []

        reference_point = self.get_involute_point(self.radius)
        reference_angle = self.get_angle_of_circle_points(
            reference_point,
            [reference_point[0], -1 * reference_point[1]],
            [0, 0],
            self.radius,
        )

        while radius <= self.tip_radius:
            point = self.get_involute_point(radius)

            new_point = self.rotate(point, 0)
            contact_points.append(new_point)

            inverted_new_point = self.rotate(
                [point[0], -1 * point[1]], reference_angle + self.teeth_angle / 2
            )
            inverted_contact_points.append(inverted_new_point)

            radius += step

        inverted_contact_points.reverse()

        # Fillet Curve Points
        fillet_points = []
        inverted_fillet_points = []
        first_point = inverted_contact_points[-1]
        second_point = self.rotate(contact_points[0], self.teeth_angle)
        third_point = self.rotate(
            [self.root_radius, 0], (self.teeth_angle) * (3 / 4) + reference_angle / 2
        )

        center, radius = find_circle(
            first_point[0],
            first_point[1],
            third_point[0],
            third_point[1],
            second_point[0],
            second_point[1],
        )
        inside_angle = self.get_angle_of_circle_points(
            first_point,
            second_point,
            center,
            radius,
            invert_positive=True,
            print_image=True,
        )

        # print("center", center, "radius", radius, "inside_angle", inside_angle)

        for i in range(GEAR_INSIDE_POINTS):
            if i == 0:
                continue

            angle = (inside_angle / 40) * i

            point = self.rotate(first_point, -angle, center=center)
            fillet_points.append(point)

            point = self.rotate(second_point, angle, center=center)
            point = self.rotate(point, -self.teeth_angle)
            inverted_fillet_points.append(point)

        inverted_fillet_points.reverse()

        # Tip Curve Points
        tip_points = []
        inverted_tip_points = []
        outside_angle = self.get_angle_of_circle_points(
            contact_points[-1], inverted_contact_points[0], [0, 0], self.tip_radius
        )
        for i in range(GEAR_TIP_POINTS):
            if i == 0:
                continue

            angle = (outside_angle / 20) * i

            point = self.rotate(contact_points[-1], angle, center=[0, 0])
            tip_points.append(point)

            point = self.rotate(inverted_contact_points[0], -angle, center=[0, 0])
            inverted_tip_points.append(point)

        inverted_tip_points.reverse()

        points = (
            inverted_fillet_points
            + contact_points
            + tip_points
            + inverted_tip_points
            + inverted_contact_points
            + fillet_points
        )

        print("Total Points", len(points))
        final_points = []
        for i in range(1):
            for point in points:
                new_point = self.rotate(point, self.teeth_angle * i)
                final_points.append(new_point)

        # self.print_new_image(final_points)

        return points

    def get_involute_point(self, radius):
        pressure_angle = math.acos(self.base_radius / radius)
        inverse_angle = math.tan(pressure_angle) - pressure_angle

        x = radius * math.cos(inverse_angle)
        y = radius * math.sin(inverse_angle)

        return [x, y]

    def get_angle_of_circle_points(
        self, a, b, center, radius, invert_positive=False, print_image=False
    ):
        centered_a = [
            a[0] - center[0],
            a[1] - center[1],
        ]
        centered_b = [
            b[0] - center[0],
            b[1] - center[1],
        ]
        midpoint = [
            centered_a[0] + (centered_b[0] - centered_a[0]) / 2,
            centered_a[1] + (centered_b[1] - centered_a[1]) / 2,
        ]
        chord_distance = self.distance(centered_a, centered_b)
        center_distance = self.distance(midpoint, [0, 0])

        """
        return math.acos(
            (
                math.pow(2 * radius, 2) - 
                math.pow(distance, 2)
            ) / 
            math.pow(2 * radius, 2)
        )
        """

        points = [
            [0, 0],
            centered_a,
            centered_b,
            midpoint,
        ]

        if print_image:
            print("CIRCLE POINTS", points)
            # self.print_new_image(points, filename="fillet_test.png", circles=False)

        angle = 2 * math.atan(chord_distance / (2 * center_distance))

        if invert_positive and midpoint[0] > 0 and midpoint[1] > 0:
            angle = 2 * math.pi - angle

        return angle

    def distance(self, a, b):
        return math.sqrt(math.pow(a[0] - b[0], 2) + math.pow(a[1] - b[1], 2))

    def rotate(self, point, angle, center=[0, 0]):
        """
        Rotate a point counterclockwise by a given angle around a given origin.

        The angle should be given in radians.
        """
        ox, oy = (center[0], center[1])
        px, py = (point[0], point[1])

        qx = ox + math.cos(angle) * (px - ox) - math.sin(angle) * (py - oy)
        qy = oy + math.sin(angle) * (px - ox) + math.cos(angle) * (py - oy)

        return [qx, qy]

    def print_new_image(self, points, filename="output.png", circles=True):
        new_image = Image.new("RGB", [IMAGE_SCALE, IMAGE_SCALE], (255, 255, 255, 0))

        scale = IMAGE_SCALE / (self.tip_radius * 2 + 10)

        if circles:
            # Print Circles
            for i in range(360):
                angle = (math.pi * 2 / 360) * i
                new_point = self.rotate([self.radius, 0], angle)
                new_image.putpixel(
                    (
                        int(new_point[0] * scale + (IMAGE_SCALE / 2)),
                        int(new_point[1] * scale + (IMAGE_SCALE / 2)),
                    ),
                    (0, 0, 255, 1),
                )

                new_point = self.rotate([self.base_radius, 0], angle)
                new_image.putpixel(
                    (
                        int(new_point[0] * scale + (IMAGE_SCALE / 2)),
                        int(new_point[1] * scale + (IMAGE_SCALE / 2)),
                    ),
                    (255, 0, 0, 1),
                )

                new_point = self.rotate([self.tip_radius, 0], angle)
                new_image.putpixel(
                    (
                        int(new_point[0] * scale + (IMAGE_SCALE / 2)),
                        int(new_point[1] * scale + (IMAGE_SCALE / 2)),
                    ),
                    (0, 0, 255, 1),
                )

                new_point = self.rotate([self.root_radius, 0], angle)
                new_image.putpixel(
                    (
                        int(new_point[0] * scale + (IMAGE_SCALE / 2)),
                        int(new_point[1] * scale + (IMAGE_SCALE / 2)),
                    ),
                    (0, 0, 255, 1),
                )

            for i in range(IMAGE_SCALE):
                new_image.putpixel((int(IMAGE_SCALE / 2), i), (0, 0, 0, 1))
                new_image.putpixel((i, int(IMAGE_SCALE / 2)), (0, 0, 0, 1))

        count = 0
        for point in points:
            new_image.putpixel(
                (
                    int(point[0] * scale + (IMAGE_SCALE / 2)),
                    int(point[1] * scale + (IMAGE_SCALE / 2)),
                ),
                (0, count % 255, 0, 1),
            )

            count += 2

        print("## Creating Image", filename)
        new_image.save("output_images/%s" % (filename))
