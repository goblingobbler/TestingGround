from PIL import Image, ImageDraw

from ast import literal_eval
from copy import deepcopy

from helpers import calc_color_diff, get_directions, get_direction_opposites, get_angles, get_directions_for_distance

import pprint

class ImageEditor():
    def __init__(self, path):
        self.image = Image.open(path)

        # prints format of image
        print(self.image.format)

        # prints mode of image
        print(self.image.mode)


        self.width, self.height = self.image.size

        self.pixels = self.refresh_pixels(self.image)
        self.draw = ImageDraw.Draw(self.image)

        self.direction_opposites = get_direction_opposites()


    def refresh_pixels(self, image):
        print('Printing Pixels')
        pixels = list(image.getdata())
        new_pixels = [pixels[i * self.width:(i + 1) * self.width] for i in range(self.height)]

        return new_pixels

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

        angles = get_angles(self.width, self.height)

        for key in angles:
            angle = angles[key]
            for i in angle[0]:
                for j in angle[1]:
                    point = [j,i]
                    color = str(self.pixels[i][j])

                    directions = get_directions()

                    all_colors = 0
                    same_color = 0
                    color_lookup = {}

                    for key in directions:
                        direction = directions[key]

                        new_point = [
                            point[0] + direction[0],
                            point[1] + direction[1],
                        ]

                        if not self.check_point_inside(new_point):
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

                directions = get_directions()

                tension = 0
                for key in directions:
                    direction = directions[key]
                    
                    new_point = [
                        point[0] + direction[0],
                        point[1] + direction[1],
                    ]

                    if not self.check_point_inside(new_point):
                        continue

                    new_color = self.pixels[new_point[1]][new_point[0]]

                    tension += calc_color_diff(color, new_color)

                tension_pixels[i][j] = tension
                if tension > max_tension:
                    max_tension = tension

        self.print_new_image(filename, tension_pixels, max_tension)


    def find_lines(self, threshold=100):
        #starting_point = None
        line_points = []
        for i in range(self.height):
            for j in range(self.width):
                point = [j,i]
                
                new_color_total = self.calc_color_total(point)

                if new_color_total / 9 > threshold:
                    #starting_point = point
                    line_points.append(point)
                    #break
            #if starting_point:
            #    break

        print('line points found')

        line_image = Image.new("RGB", self.image.size, (255, 255, 255, 0))
        line_pixels = self.refresh_pixels(line_image)
        for i in range(self.height):
            for j in range(self.width):
                point = [j,i]
                line_pixels[i][j] = 0
            
        for point in line_points:
            line_pixels[point[1]][point[0]] = 255
        
        print_lines = deepcopy(line_pixels)
        self.print_new_image('lines.jpg', print_lines)
        print('Lines Complete')
        
        thin_pixels = self.thin_lines(line_pixels)

        print_lines = deepcopy(thin_pixels)
        self.print_new_image('thin_lines.png', print_lines)

        starting_point = None
        for i in range(self.height):
            for j in range(self.width):
                point = [j,i]

                if thin_pixels[i][j] != 255:
                    continue
            
                starting_point = point
                break

            if starting_point:
                break

        print('Starting Point', starting_point)
        if starting_point:
            line_points = []
            all_points = []
            next_point = self.search_for_next_line_point(thin_pixels, starting_point, all_points, threshold=threshold)

            while next_point:
                line_points.append(next_point)
                all_points.append(next_point)
                next_point = self.search_for_next_line_point(thin_pixels, next_point, all_points, threshold=threshold)

            pprint.pprint(line_points)
        
        line_image = Image.new("RGB", self.image.size, (255, 255, 255, 0))
        line_pixels = self.refresh_pixels(line_image)
        for i in range(self.height):
            for j in range(self.width):
                point = [j,i]
                line_pixels[i][j] = 0
            
        for point in line_points:
            line_pixels[point[1]][point[0]] = 255

        self.print_new_image('found_lines.png', line_pixels)


    def thin_lines(self, pixels):
        last_changed = None

        angles = get_angles(self.width, self.height)
        directions = get_directions(primary=True)
        double_directions = get_directions(primary=True, length=2)
        
        for key in ['upper_left', 'lower_right']:
            angle = angles[key]
            for i in angle[0]:
                for j in angle[1]:
                    point = [j,i]

                    color = pixels[i][j]
                    if color != 255:
                        continue
                    
                    if key == 'upper_left':
                        direction_key = 'left'
                    elif key == 'lower_right':
                        direction_key = 'right'

                    direction = directions[direction_key]
                    double_direction = double_directions[direction_key]

                    self.check_next_point_for_thickness(point, pixels, direction, double_direction)

        for key in ['upper_right', 'lower_left']:
            angle = angles[key]
            for j in angle[1]:
                for i in angle[0]:
                    point = [j,i]
                    
                    color = pixels[i][j]
                    if color != 255:
                        continue
                    
                    if key == 'upper_right':
                        direction_key = 'down'
                    elif key == 'lower_left':
                        direction_key = 'up'

                    direction = directions[direction_key]
                    double_direction = double_directions[direction_key]

                    self.check_next_point_for_thickness(point, pixels, direction, double_direction)

        
        return pixels

    def check_next_point_for_thickness(self,point, pixels, direction, double_direction):
        new_point = [
            point[0] + direction[0],
            point[1] + direction[1],
        ]

        if not self.check_point_inside(new_point):
            return False
        
        double_point = [
            point[0] + double_direction[0],
            point[1] + double_direction[1],
        ]
        if not self.check_point_inside(double_point):
            return False

        if pixels[new_point[1]][new_point[0]] == 255 and pixels[double_point[1]][double_point[0]] != 255:
            pixels[new_point[1]][new_point[0]] = 0

        return True

    def search_for_next_line_point(self, pixels, point, last_points, threshold=100):
        

        next_point = None
        for distance in range(1,5):
            directions = get_directions_for_distance(distance)
            for direction in directions:
                new_point = [
                    point[0] + direction[0],
                    point[1] + direction[1],
                ]
                if new_point in last_points:
                    continue

                if not self.check_point_inside(new_point):
                    continue
                
                if pixels[new_point[1]][new_point[0]] == 255:
                    next_point = new_point
                    break
            
            print('Next Point', next_point)
            if next_point:
                '''
                for opposite in self.direction_opposites[next_point_key]:
                    direction = directions[opposite]
                    new_point = [
                        next_point[0] + direction[0],
                        next_point[1] + direction[1],
                    ]

                    if not self.check_point_inside(new_point):
                        continue

                    #last_points.append(new_point)
                '''
                break 

        return next_point


    def calc_color_total(self, point, pixels=None):
        if not pixels:
            pixels = self.pixels

        length = 1
        directions = get_directions()

        color_total = list(pixels[point[1]][point[0]])[0]

        for key in directions:
            direction = directions[key]

            new_point = [
                point[0] + direction[0],
                point[1] + direction[1],
            ]

            if not self.check_point_inside(new_point):
                continue

            new_color = pixels[new_point[1]][new_point[0]]
            color_total += new_color[0]

        return color_total

    def check_point_inside(self, point):
        if point[0] < 0 or point[0] >= self.width:
            return False
        if point[1] < 0 or point[1] >= self.height:
            return False

        return True  

    def print_new_image(self, filename, pixels, scale=255):
        new_image = Image.new("RGB", self.image.size, (255, 255, 255, 0))

        for i in range(self.height):
            for j in range(self.width):
                color_value = int((pixels[i][j] / scale) * 255)
                pixels[i][j] = (color_value, color_value, color_value)
        
                new_image.putpixel((j,i), pixels[i][j])
    
        new_image.save('output_images\\%s' % (filename))


    def print_pixel_list(self):
        for i in range(self.height):
            for j in range(self.width):
                self.image.putpixel((j,i), self.pixels[i][j])


    def snapshot(self, filename='output.jpg'):
        self.image.save('output_images\\%s' % (filename))
