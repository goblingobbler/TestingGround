from PIL import Image, ImageDraw
import random

from crystal import Crystal


class PetriDish():
    def __init__(self, path):
        self.image = Image.open(path)

        # prints format of image
        print(self.image.format)

        # prints mode of image
        print(self.image.mode)


        self.width, self.height = self.image.size

        self.refresh_pixels()
        self.draw = ImageDraw.Draw(self.image)

        self.dead_image = Image.new("RGB", self.image.size, (255, 255, 255, 0))
        self.refresh_dead_pixels()
        self.dead_draw = ImageDraw.Draw(self.dead_image)

        self.crystals = []

    def refresh_pixels(self):
        print('Printing Pixels')
        pixels = list(self.image.getdata())
        self.pixels = [pixels[i * self.width:(i + 1) * self.width] for i in range(self.height)]

    def refresh_dead_pixels(self):
        print('Printing Dead Pixels')
        dead_pixels = list(self.dead_image.getdata())
        self.dead_pixels = [dead_pixels[i * self.width:(i + 1) * self.width] for i in range(self.height)]

    def spawn_crystals(self, num=4):
        for i in range(num):
            spawned = False
            trys = 0

            while not spawned and trys < 10:
                overlap = False
                x = random.randint(2, self.width - 3)
                y = random.randint(2, self.height - 3)

                if self.dead_pixels[y][x] == (0,0,0):
                    overlap = True
                else:
                    for crystal in self.crystals:
                        if crystal.dead:
                            continue
                            
                        if crystal.is_inside([x, y]):
                            print('SPAWN FAILED!')
                            overlap = True
                            break

                if overlap:
                    trys += 1
                    continue

                crystal = Crystal(self.pixels, self.crystals, self.dead_pixels, x, y)
                self.crystals.append(crystal)

                spawned = True
                print('spawn', [x, y])

    def grow_crystals(self, steps=1, length=1, color_diff=40):
        step_interval = int(steps/20)
        if step_interval < 1:
            step_interval = 1

        for step in range(steps):
            count = 0
            for crystal in self.crystals:
                if crystal.grow(length=length, color_diff=color_diff):
                    count += 1

                if crystal.stuck and not crystal.dead:
                    self.print_dead_crystal(crystal)

            if step % step_interval == 0:
                print(step, count, '/', len(self.crystals), 'grown')

    def print_dead_crystal(self, crystal):
        self.dead_draw.polygon(
            [
                crystal.points[0][0], crystal.points[0][1],
                crystal.points[1][0], crystal.points[1][1],
                crystal.points[2][0], crystal.points[2][1],
            ],
            (0, 0, 0),
        )

        self.refresh_dead_pixels()
        crystal.dead = True

    def print_crystals(self):
        for crystal in self.crystals:
            self.draw.polygon(
                [
                    crystal.points[0][0], crystal.points[0][1],
                    crystal.points[1][0], crystal.points[1][1],
                    crystal.points[2][0], crystal.points[2][1],
                ],
                crystal.starting_color,
                (0, 0, 0),
            )
            print(crystal.points)


    def snapshot(self, filename='output.jpg'):
        self.print_crystals()
        self.image.save(filename)
