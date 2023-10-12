from petri_dish import PetriDish
from image_editor import ImageEditor

def main():

    #experiment = ImageEditor('input_images\\numbers.jpg')
    #simplify(experiment)

    experiment = ImageEditor('output_images\\tension3.jpg')
    experiment.find_lines(threshold=80)




def simplify(experiment):
    
    experiment.calculate_tension(filename='tension.jpg')
    print('First Tension')

    experiment.simplify_colors(depth=4)
    experiment.print_pixel_list()
    experiment.snapshot(filename='output.jpg')
    print('Simplified')

    experiment.calculate_tension(filename='tension2.jpg')
    print('Second Tension')

    for i in range(1):
        experiment.reduce_noise()
    experiment.print_pixel_list()
    experiment.snapshot(filename='output3.jpg')
    print('Noise Reduced')
    
    experiment.calculate_tension(filename='tension3.jpg')
    print('Third Tension')
    
    
    


def make_crystals(experiment):
    experiment.spawn_crystals(num=1)
    experiment.grow_crystals(steps=2000, length=2, color_diff=150)
    experiment.print_dead_crystal(experiment.crystals[0])



if __name__ == "__main__":
    main()
