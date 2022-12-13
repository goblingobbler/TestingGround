from image import PetriDish

def main():

    experiment = PetriDish('test2.jpg')

    experiment.spawn_crystals(num=100)
    experiment.grow_crystals(steps=2000)

    experiment.spawn_crystals(num=100)
    experiment.grow_crystals(steps=1000)

    experiment.spawn_crystals(num=200)
    experiment.grow_crystals(steps=1000)

    experiment.snapshot()


if __name__ == "__main__":
    main()
