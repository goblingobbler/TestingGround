import math

from objects.petri_dish import PetriDish
from objects.image_editor import ImageEditor
from objects.stl_editor import STLEditor

from objects.vase import Vase
from objects.gears import Gears


def main():

    gear = Gears(teeth=10, module=1)
    faces = gear.make_gear_faces()
    editor = STLEditor()
    editor.output_face_list(face_list=faces, filename='gear.stl')
    
    gear = Gears(teeth=20, module=1)
    faces = gear.make_gear_faces()
    editor = STLEditor()
    editor.output_face_list(face_list=faces, filename='gear2.stl')

    gear = Gears(teeth=40, module=1)
    faces = gear.make_gear_faces()
    editor = STLEditor()
    editor.output_face_list(face_list=faces, filename='gear3.stl')

    '''
    vase = Vase()

    #all_faces = vase.simple_helix_vase()
    #all_faces = vase.simple_bulb_vase()

    all_faces = vase.test_vase()
    
    editor = STLEditor()
    editor.output_face_list(face_list=all_faces, filename='vase.stl')
    '''

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
