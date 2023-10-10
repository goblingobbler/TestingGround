from image import PetriDish

def main():

    experiment = PetriDish('test3.jpg')

    simplify(experiment)



def simplify(experiment):
    
    experiment.calculate_tension(filename='tension.jpg')

    experiment.simplify_colors(depth=3)
    experiment.print_pixel_list()
    experiment.snapshot(filename='output.jpg')

    experiment.calculate_tension(filename='tension2.jpg')

    for i in range(3):
        experiment.reduce_noise()
    experiment.print_pixel_list()
    experiment.snapshot(filename='output3.jpg')
    
    experiment.calculate_tension(filename='tension3.jpg')
    
    


def make_crystals(experiment):
    experiment.spawn_crystals(num=1)
    experiment.grow_crystals(steps=2000, length=2, color_diff=150)
    experiment.print_dead_crystal(experiment.crystals[0])



if __name__ == "__main__":
    main()
