import math

from objects.helpers.helix import Helix


class Vase:
    def __init__(self):
        pass

    def simple_helix_vase(self):
        all_faces = []

        # Base
        helix = Helix(radial_distance=0, step=0.4, height=20)
        helix.create_circles(
            circle_radius=4.5,
            point_count=8,
            ossilation=1.5,
            ossilation_steps=48,
            ossilation_start=math.pi / 2,
            total_radians=2 * math.pi,
        )
        helix.create_faces()
        all_faces.extend(helix.faces)

        # Forward
        helix = Helix(
            radial_distance=4.2,
            point_count=96,
            step=0.4,
            height=20,
        )
        helix.create_circles(
            circle_radius=2,
            point_count=8,
        )
        helix.create_faces()
        all_faces.extend(helix.faces)
        """
        helix = Helix(
            radius=4.2,
            point_count=96,
            angle_start=math.pi,
            step=0.4,
            height=20,
        )
        helix.create_circles(
            circle_radius=2,
            point_count=8,
        )
        helix.create_faces()
        all_faces.extend(helix.faces)

        # Backward
        helix = Helix(
            radius=4.2,
            point_count=96,
            angle_start=-math.pi / 2,
            step=0.4,
            height=20,
            # reverse=True,
        )
        helix.create_circles(
            circle_radius=2,
            point_count=8,
        )
        helix.create_faces()
        all_faces.extend(helix.faces)
        helix = Helix(
            radius=4.2,
            point_count=96,
            angle_start=math.pi / 2,
            step=0.4,
            height=20,
            # reverse=True,
        )
        helix.create_circles(
            circle_radius=2,
            point_count=8,
        )
        helix.create_faces()
        all_faces.extend(helix.faces)


        """
        return all_faces

    def simple_braided_vase(self):
        all_faces = []

        helix = Helix(
            radius=0,
            point_count=96,
            angle_start=0,
            step=0.4,
            height=19.2,
        )
        helix.create_circles(
            circle_radius=5,
            point_count=24,
        )
        helix.create_faces()
        all_faces.extend(helix.faces)

        angle_start = 0
        while angle_start < 2 * math.pi:
            helix = Helix(
                radius=5,
                point_count=96,
                angle_start=angle_start,
                step=0.4,
                height=19.2,
            )
            helix.create_circles(
                circle_radius=2,
                point_count=24,
            )
            helix.create_faces()
            all_faces.extend(helix.faces)

            helix = Helix(
                radius=5,
                point_count=96,
                angle_start=angle_start,
                step=0.4,
                height=19.2,
                reverse=True,
            )
            helix.create_circles(
                circle_radius=2,
                point_count=24,
            )
            helix.create_faces()
            all_faces.extend(helix.faces)

            angle_start += math.pi / 4

        return all_faces

    def simple_bulb_vase(self):
        all_faces = []

        # Base
        helix = Helix(radius=0, step=0.4, height=20)
        helix.create_circles(
            circle_radius=4,
            point_count=24,
            ossilation=2,
            ossilation_steps=48,
            ossilation_start=math.pi / 2,
        )
        helix.create_faces()
        all_faces.extend(helix.faces)

        angle_start = 0
        while angle_start < 2 * math.pi:
            helix = Helix(
                radius=5,
                point_count=0,
                angle_start=angle_start,
                step=0.4,
                height=19.2,
            )
            helix.create_circles(
                circle_radius=2,
                point_count=24,
                ossilation=2,
                ossilation_steps=48,
                ossilation_start=3 * (math.pi / 2),
            )
            helix.create_faces()
            all_faces.extend(helix.faces)

            angle_start += math.pi / 4

        return all_faces

    def test_vase(self):
        all_faces = []

        # Base
        helix = Helix(
            radius=0,
            step=0.4,
            height=20,
        )
        helix.create_circles(
            circle_radius=3.5,
            point_count=48,
            ossilation=1.5,
            ossilation_steps=48,
            ossilation_start=math.pi / 2,
        )

        helix.create_faces()
        all_faces.extend(helix.faces)

        helix = Helix(
            radius=3,
            # point_count=96,
            step=0.4,
            height=20,
            # ossilation=1.5,
            # ossilation_steps=48,
            # ossilation_start=math.pi / 2,
        )
        helix.create_circles(
            circle_radius=2,
            point_count=48,
            angle_range=[0, math.pi / 2],
        )

        helix.create_faces()
        all_faces.extend(helix.faces)

        helix.create_circles(
            circle_radius=2,
            point_count=48,
            angle_range=[math.pi, 3 * math.pi / 2],
        )

        helix.create_faces()
        all_faces.extend(helix.faces)

        helix = Helix(
            radius=3,
            # point_count=96,
            step=0.4,
            height=20,
            angle_start=math.pi,
            # ossilation=1.5,
            # ossilation_steps=48,
            # ossilation_start=math.pi / 2,
        )
        helix.create_circles(
            circle_radius=2,
            point_count=48,
            angle_range=[math.pi / 2, math.pi],
        )
        helix.create_faces()
        all_faces.extend(helix.faces)

        helix.create_circles(
            circle_radius=2,
            point_count=48,
            angle_range=[3 * math.pi / 2, 2 * math.pi],
        )
        helix.create_faces()
        all_faces.extend(helix.faces)

        return all_faces
