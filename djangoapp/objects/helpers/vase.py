import math

from objects.helpers.helix import Helix


class Vase:
    def __init__(self):
        pass

    def custom_vase(self, helix_data):
        all_faces = []

        for data in helix_data:
            # Base
            helix = Helix(
                radial_distance=data.get("radial_distance", 0),
                polar_angle=data.get("polar_angle", 0),
                steps=data.get("steps", 3),
                height=data.get("height", 3),
                rotation_about_center=data.get("rotation_about_center", 0),
                reverse=data.get("reverse", False),
            )
            helix.create_circles(
                circle_radius=data.get("circle_radius", 1),
                circle_points=data.get("circle_points", 3),
                rotation_about_self=data.get("rotation_about_self", 0),
                ossilation=data.get("ossilation", 0),
                ossilation_steps=data.get("ossilation_steps", 3),
                ossilation_start=data.get("ossilation_start", 0),
            )
            helix.create_faces()
            all_faces.extend(helix.faces)

        return all_faces

    def simple_helix_vase(self):
        all_faces = []

        # Base
        helix = Helix(radial_distance=0, steps=50, height=20)
        helix.create_circles(
            circle_radius=4.5,
            circle_points=8,
            rotation_about_self=2 * math.pi,
            ossilation=1.5,
            ossilation_steps=48,
            ossilation_start=math.pi / 2,
        )
        helix.create_faces()
        all_faces.extend(helix.faces)

        # Forward
        helix = Helix(
            radial_distance=4.2,
            rotation_about_center=math.pi,
            steps=50,
            height=20,
        )
        helix.create_circles(
            circle_radius=2,
            circle_points=8,
        )
        helix.create_faces()
        all_faces.extend(helix.faces)

        helix = Helix(
            radial_distance=4.2,
            rotation_about_center=math.pi,
            polar_angle=math.pi,
            steps=50,
            height=20,
        )
        helix.create_circles(
            circle_radius=2,
            circle_points=8,
        )
        helix.create_faces()
        all_faces.extend(helix.faces)

        # Backward
        helix = Helix(
            radial_distance=4.2,
            rotation_about_center=math.pi,
            polar_angle=-math.pi / 2,
            steps=50,
            height=20,
            # reverse=True,
        )
        helix.create_circles(
            circle_radius=2,
            circle_points=8,
        )
        helix.create_faces()
        all_faces.extend(helix.faces)
        helix = Helix(
            radial_distance=4.2,
            rotation_about_center=math.pi,
            polar_angle=math.pi / 2,
            steps=50,
            height=20,
            # reverse=True,
        )
        helix.create_circles(
            circle_radius=2,
            circle_points=8,
        )
        helix.create_faces()
        all_faces.extend(helix.faces)

        return all_faces

    def simple_braided_vase(self):
        all_faces = []

        helix = Helix(
            radial_distance=0,
            rotation_about_center=math.pi,
            polar_angle=0,
            steps=48,
            height=19.2,
        )
        helix.create_circles(
            circle_radius=5,
            circle_points=24,
        )
        helix.create_faces()
        all_faces.extend(helix.faces)

        polar_angle = 0
        while polar_angle < 2 * math.pi:
            helix = Helix(
                radial_distance=5,
                rotation_about_center=math.pi,
                polar_angle=polar_angle,
                steps=48,
                height=19.2,
            )
            helix.create_circles(
                circle_radius=2,
                circle_points=24,
            )
            helix.create_faces()
            all_faces.extend(helix.faces)

            helix = Helix(
                radial_distance=5,
                rotation_about_center=math.pi,
                polar_angle=polar_angle,
                steps=48,
                height=19.2,
                reverse=True,
            )
            helix.create_circles(
                circle_radius=2,
                circle_points=24,
            )
            helix.create_faces()
            all_faces.extend(helix.faces)

            polar_angle += math.pi / 4

        return all_faces

    def simple_bulb_vase(self):
        all_faces = []

        # Base
        helix = Helix(radial_distance=0, steps=50, height=20)
        helix.create_circles(
            circle_radius=4,
            circle_points=24,
            ossilation=2,
            ossilation_steps=48,
            ossilation_start=math.pi / 2,
        )
        helix.create_faces()
        all_faces.extend(helix.faces)

        polar_angle = 0
        while polar_angle < 2 * math.pi:
            helix = Helix(
                radial_distance=5,
                polar_angle=polar_angle,
                steps=48,
                height=19.2,
            )
            helix.create_circles(
                circle_radius=2,
                circle_points=24,
                ossilation=2,
                ossilation_steps=48,
                ossilation_start=3 * (math.pi / 2),
            )
            helix.create_faces()
            all_faces.extend(helix.faces)

            polar_angle += math.pi / 4

        return all_faces

    def test_vase(self):
        all_faces = []

        # Base
        helix = Helix(
            radial_distance=0,
            steps=50,
            height=20,
        )
        helix.create_circles(
            circle_radius=3.5,
            circle_points=48,
            ossilation=1.5,
            ossilation_steps=48,
            ossilation_start=math.pi / 2,
        )

        helix.create_faces()
        all_faces.extend(helix.faces)

        helix = Helix(
            radial_distance=3,
            # rotation_about_center=math.pi,
            steps=50,
            height=20,
            # ossilation=1.5,
            # ossilation_steps=48,
            # ossilation_start=math.pi / 2,
        )
        helix.create_circles(
            circle_radius=2,
            circle_points=48,
            angle_range=[0, math.pi / 2],
        )

        helix.create_faces()
        all_faces.extend(helix.faces)

        helix.create_circles(
            circle_radius=2,
            circle_points=48,
            angle_range=[math.pi, 3 * math.pi / 2],
        )

        helix.create_faces()
        all_faces.extend(helix.faces)

        helix = Helix(
            radial_distance=3,
            # rotation_about_center=math.pi,
            steps=50,
            height=20,
            polar_angle=math.pi,
            # ossilation=1.5,
            # ossilation_steps=48,
            # ossilation_start=math.pi / 2,
        )
        helix.create_circles(
            circle_radius=2,
            circle_points=48,
            angle_range=[math.pi / 2, math.pi],
        )
        helix.create_faces()
        all_faces.extend(helix.faces)

        helix.create_circles(
            circle_radius=2,
            circle_points=48,
            angle_range=[3 * math.pi / 2, 2 * math.pi],
        )
        helix.create_faces()
        all_faces.extend(helix.faces)

        return all_faces
