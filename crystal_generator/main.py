import math

from objects.petri_dish import PetriDish
from objects.image_editor import ImageEditor


def main():
    image = "input_images/test.jpg"

    experiment = ImageEditor(image)
    experiment.simplify_colors_contextually(max_distance=40)

    experiment.print_pixel_list()
    experiment.snapshot(filename=f"output.png")

    experiment = ImageEditor(image)
    experiment.simplify_colors_contextually(max_distance=50)

    experiment.print_pixel_list()
    experiment.snapshot(filename=f"output2.png")

    experiment = ImageEditor(image)
    experiment.simplify_colors_contextually(max_distance=60)

    experiment.print_pixel_list()
    experiment.snapshot(filename=f"output3.png")

    experiment = ImageEditor(image)
    experiment.simplify_colors(depth=5)

    experiment.print_pixel_list()
    experiment.snapshot(filename=f"output4.png")

    # experiment = ImageEditor('input_images\\symbols_tension.png')
    # experiment.find_lines(threshold=80)


def simplify(experiment):

    experiment.calculate_tension(filename="tension.png")
    print("First Tension")

    experiment.simplify_colors(depth=4)
    experiment.print_pixel_list()
    experiment.snapshot(filename="output.png")
    print("Simplified")

    experiment.calculate_tension(filename="tension2.png")
    print("Second Tension")

    experiment.reduce_noise()
    experiment.print_pixel_list()
    experiment.snapshot(filename="output3.png")
    print("Noise Reduced")

    experiment.calculate_tension(filename="tension3.png")
    print("Third Tension")


def make_crystals(experiment):
    experiment.spawn_crystals(num=1)
    experiment.grow_crystals(steps=2000, length=2, color_diff=150)
    experiment.print_dead_crystal(experiment.crystals[0])


if __name__ == "__main__":
    main()
