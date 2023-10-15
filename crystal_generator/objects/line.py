
from helpers.directions import get_directions, get_direction_opposites

class Line():
    def __init__(self, color):
        self.pixels = []
        self.color = color

        self.pixels_string = ''

    def add_pixel(self, pixel):
        self.pixels.append(pixel)
        self.pixels_string += '%s,%s:' % (pixel[0], pixel[1])

    def contains(self, pixel):
        pixel_string = '%s,%s' % (pixel[0], pixel[1])
        if pixel_string in self.pixels_string:
            return True
        
        return False
    
    def reduce(self):
        directions = get_directions(primary=True)
        opposites = get_direction_opposites(primary=True)

        new_pixels = []
        last_pixel = None
        for i in range(len(self.pixels) - 1):
            pixel = self.pixels[i]

            skip = False

            if not last_pixel:
                last_pixel = pixel
                new_pixels.append(pixel)
                continue

            for key in directions:
                direction = directions[key]

                new_pixel = [
                    pixel[0] + direction[0],
                    pixel[1] + direction[1],
                ]

                if new_pixel == last_pixel:
                    opposite_direction = directions[opposites[key]]
                    next_pixel = [
                        pixel[0] + opposite_direction[0],
                        pixel[1] + opposite_direction[1],
                    ]

                    if next_pixel == self.pixels[i+1]:
                        skip = True

                    break
            
            if not skip:
                new_pixels.append(pixel)
            
            last_pixel = pixel
            
        print('Reduced', len(self.pixels), len(new_pixels))
        self.pixels = new_pixels


    def draw_line(self, image_pixels):
        for point in self.pixels:
            image_pixels[point[1]][point[0]] = (self.color[0], self.color[1], self.color[2])

        return image_pixels