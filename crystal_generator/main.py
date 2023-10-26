import math

from objects.petri_dish import PetriDish
from objects.image_editor import ImageEditor
from objects.stl_editor import STLEditor

from objects.helix import Helix

def main():
    all_faces = simple_helix_vase()

    all_faces = []

    helix = Helix(
        radius=4, 
        point_count=96,
        angle_start=0,
        step=.4, 
        height=19.2 * 2,
    )
    helix.create_circles(
        circle_radius=5, 
        point_count=24, 
        ossilation=.5, 
        ossilation_steps=12, 
        ossilation_start=math.pi / 2, 
    )
    helix.create_faces()
    all_faces.extend(helix.faces)

    all_faces = simple_bulb_vase()
    
    editor = STLEditor()
    editor.output_face_list(face_list=all_faces, filename='spiral.stl')

    '''
    experiment = ImageEditor('input_images\\card_bold.png')
    simplify(experiment)

    experiment = ImageEditor('output_images\\tension3.png')
    experiment.find_lines(threshold=70)

    #experiment = ImageEditor('input_images\\symbols_tension.png')
    #experiment.find_lines(threshold=80)

    editor = STLEditor()
    editor.output_point_lists(point_lists=experiment.lines)

    '''


def simple_helix_vase():
    all_faces = []
    
    # Base
    helix = Helix(
        radius=0, 
        step=.4, 
        height=20
    )
    helix.create_circles(
        circle_radius=4.5, 
        point_count=8, 
        ossilation=1.5, 
        ossilation_steps=48, 
        ossilation_start=math.pi / 2, 
        rotation_steps=48
    )
    helix.create_faces()
    all_faces.extend(helix.faces)
    
    # Forward
    helix = Helix(
        radius=4.2, 
        point_count=96,
        step=.4, 
        height=20,
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
        angle_start=math.pi,
        step=.4, 
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
        angle_start= - math.pi / 2,
        step=.4, 
        height=20,
        #reverse=True,
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
        step=.4, 
        height=20,
        #reverse=True,
    )
    helix.create_circles(
        circle_radius=2, 
        point_count=8, 
    )
    helix.create_faces()
    all_faces.extend(helix.faces)

    return all_faces


def simple_braided_vase():
    all_faces = []

    helix = Helix(
        radius=0, 
        point_count=96,
        angle_start=0,
        step=.4, 
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
            step=.4, 
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
            step=.4, 
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



def simple_bulb_vase():
    all_faces = []

    # Base
    helix = Helix(
        radius=0, 
        step=.4, 
        height=20
    )
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
            angle_start=angle_start,
            step=.4, 
            height=19.2,
        )
        helix.create_circles(
            circle_radius=2, 
            point_count=24, 
            ossilation=2, 
            ossilation_steps=48, 
            ossilation_start= 3 * (math.pi / 2), 
        )
        helix.create_faces()
        all_faces.extend(helix.faces)

        angle_start += math.pi / 4

    return all_faces



def simplify(experiment):
    
    experiment.calculate_tension(filename='tension.png')
    print('First Tension')

    experiment.simplify_colors(depth=4)
    experiment.print_pixel_list()
    experiment.snapshot(filename='output.png')
    print('Simplified')

    experiment.calculate_tension(filename='tension2.png')
    print('Second Tension')

    for i in range(1):
        experiment.reduce_noise()
    experiment.print_pixel_list()
    experiment.snapshot(filename='output3.png')
    print('Noise Reduced')
    
    experiment.calculate_tension(filename='tension3.png')
    print('Third Tension')
    
    
    


def make_crystals(experiment):
    experiment.spawn_crystals(num=1)
    experiment.grow_crystals(steps=2000, length=2, color_diff=150)
    experiment.print_dead_crystal(experiment.crystals[0])



if __name__ == "__main__":
    main()
