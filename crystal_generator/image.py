from PIL import Image, ImageDraw
import random
import math
import sys

from crystal import Crystal
from ast import literal_eval

from helpers import calc_color_diff

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

    def simplify_colors(self, depth=100):
        step = int(255/depth)

        all_colors = []
        for i in range(self.height):
            for j in range(self.width):
                color = list(self.pixels[i][j])
                for k in range(3):
                    diff = (color[k] % step) - int(step/2)
                    color[k] = color[k] - diff

                #print(self.pixels[i][j], tuple(color))
                self.pixels[i][j] = tuple(color)

                if color not in all_colors:
                    all_colors.append(color)

        #print(len(all_colors))
    
    def reduce_noise(self):
        length = 1

        angles = [
            [
                range(self.height),
                range(self.width)
            ],
            [
                range(self.height),
                [self.width - i - 1 for i in range(self.width)]
            ],
            [
                [self.height - i - 1 for i in range(self.height)],
                range(self.width)
            ],
            [
                [self.height - i - 1 for i in range(self.height)],
                [self.width - i - 1 for i in range(self.width)]
            ],
        ]

        for angle in angles:
            for i in angle[0]:
                for j in angle[1]:
                    point = [j,i]
                    color = str(self.pixels[i][j])

                    directions = [
                        [length, 0],
                        [-1 * length, 0],
                        [0, length],
                        [0, -1 * length],

                        [length, length],
                        [-1 * length, length],
                        [length, -1 * length],
                        [-1 * length, -1 * length],
                    ]

                    all_colors = 0
                    same_color = 0
                    color_lookup = {}

                    for direction in directions:
                        new_point = [
                            point[0] + direction[0],
                            point[1] + direction[1],
                        ]

                        if new_point[0] < 0 or new_point[0] >= self.width:
                            continue
                        if new_point[1] < 0 or new_point[1] >= self.height:
                            continue

                        new_color = str(self.pixels[new_point[1]][new_point[0]])
                        if new_color not in color_lookup:
                            color_lookup[new_color] = 0

                        color_lookup[new_color] += 1

                        if new_color == color:
                            same_color += 1

                        all_colors += 1

                    max = 0
                    max_color = color
                    for key in color_lookup:
                        if color_lookup[key] > max:
                            max = color_lookup[key]
                            max_color = key
                            
                    #print(same_color, all_colors, color_lookup)
                    if same_color != max and float(max) / float(all_colors) > .5:
                        self.pixels[i][j] = literal_eval(max_color)

    def calculate_tension(self, filename='tension.jpg'):
        length = 1

        tension_pixels = []
        for i in range(self.height):
            tension_pixels.append([])
            for j in range(self.width):
                tension_pixels[i].append(0)
        
        max_tension = 0
        for i in range(self.height):
            for j in range(self.width):
                point = [j,i]
                color = list(self.pixels[i][j])

                directions = [
                    [length, 0],
                    [-1 * length, 0],
                    [0, length],
                    [0, -1 * length],

                    [length, length],
                    [-1 * length, length],
                    [length, -1 * length],
                    [-1 * length, -1 * length],
                ]

                tension = 0
                for direction in directions:
                    new_point = [
                        point[0] + direction[0],
                        point[1] + direction[1],
                    ]

                    if new_point[0] < 0 or new_point[0] >= self.width:
                        continue
                    if new_point[1] < 0 or new_point[1] >= self.height:
                        continue

                    new_color = self.pixels[new_point[1]][new_point[0]]

                    tension += calc_color_diff(color, new_color)

                tension_pixels[i][j] = tension
                if tension > max_tension:
                    max_tension = tension


        tension_image = Image.new("RGB", self.image.size, (255, 255, 255, 0))

        for i in range(self.height):
            for j in range(self.width):
                color_value = int((tension_pixels[i][j] / max_tension) * 255)
                tension_pixels[i][j] = (color_value, color_value, color_value)
        
                tension_image.putpixel((j,i), tension_pixels[i][j])
    
        tension_image.save(filename)


    def print_pixel_list(self):
        for i in range(self.height):
            for j in range(self.width):
                self.image.putpixel((j,i), self.pixels[i][j])


    def snapshot(self, filename='output.jpg'):
        self.print_crystals()

        #self.dead_image.show()
        #self.image.show()
        self.image.save(filename)
