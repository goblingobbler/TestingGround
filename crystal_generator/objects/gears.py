import math
from math import pow, sqrt

from PIL import Image, ImageDraw

IMAGE_SCALE = 4000

PRESSURE_ANGLE = 20 #Degrees

def deg_to_rad(deg):
    return deg * (math.pi / 180)


def rad_to_deg(rad):
    return rad * (180 / math.pi)

def find_circle(x1, y1, x2, y2, x3, y3):
    x12 = x1 - x2; 
    x13 = x1 - x3; 
 
    y12 = y1 - y2; 
    y13 = y1 - y3; 
 
    y31 = y3 - y1; 
    y21 = y2 - y1; 
 
    x31 = x3 - x1; 
    x21 = x2 - x1; 
 
    # x1^2 - x3^2 
    sx13 = pow(x1, 2) - pow(x3, 2); 
 
    # y1^2 - y3^2 
    sy13 = pow(y1, 2) - pow(y3, 2); 
 
    sx21 = pow(x2, 2) - pow(x1, 2); 
    sy21 = pow(y2, 2) - pow(y1, 2); 
 
    print(sx13, sy13, sx21, sx21)
    f = (((sx13) * (x12) + (sy13) *
          (x12) + (sx21) * (x13) +
          (sy21) * (x13)) / (2 *
          ((y31) * (x12) - (y21) * (x13))));
             
    g = (((sx13) * (y12) + (sy13) * (y12) +
          (sx21) * (y13) + (sy21) * (y13)) /
          (2 * ((x31) * (y12) - (x21) * (y13)))); 
 
    c = (-pow(x1, 2) - pow(y1, 2) -
         2 * g * x1 - 2 * f * y1); 
 
    # eqn of circle be x^2 + y^2 + 2*g*x + 2*f*y + c = 0 
    # where centre is (h = -g, k = -f) and 
    # radius r as r^2 = h^2 + k^2 - c 
    h = -g; 
    k = -f; 
    sqr_of_r = h * h + k * k - c; 
 
    # r is the radius 
    r = sqrt(sqr_of_r); 
 
    print("Centre = (", h, ", ", k, ")"); 
    print("Radius = ", r); 

    return [h,k], r


class Gears():
    def __init__(self, teeth=10, module=.2):
        
        self.teeth = teeth
        self.teeth_angle = (2 * math.pi) / self.teeth

        self.module = module
        self.pitch = self.module * math.pi
        self.pressure_angle = deg_to_rad(PRESSURE_ANGLE)

        self.radius = self.teeth * self.module / 2

        self.addendum = 1.0 * self.module
        self.dedendum = 1.25 * self.module
        self.tooth_depth = 2.25 * self.module

        self.working_depth = 2.0 * self.module
        self.root_clearance = .25 * self.module

        self.fillet_radius = .38 * self.module

        self.base_radius = self.radius * math.cos(self.pressure_angle)
        self.tip_radius = self.radius + self.addendum
        self.root_radius = self.radius - self.dedendum

        print(self.tip_radius, self.radius, self.base_radius, self.root_radius)


    def gear_points(self):
        diff = self.tip_radius - self.base_radius
        step = diff/100

        radius = self.base_radius
        points = []
        inverted_points = []

        reference_point = self.get_involute_point(self.radius)
        reference_angle = math.acos(
            (
                math.pow(2 * self.radius, 2) - 
                math.pow(2 * reference_point[1], 2)
            ) / 
            math.pow(2 * self.radius, 2)
        )
        print(reference_point[1], reference_angle)

        while radius <= self.tip_radius:
            point = self.get_involute_point(radius)

            #print(radius, pressure_angle, inverse_angle, x, y)

            new_point = self.rotate(point, 0)
            points.append(new_point)

            inverted_new_point = self.rotate([point[0],-1 * point[1]], reference_angle + self.teeth_angle / 2)
            inverted_points.append(inverted_new_point)
            
            radius += step

        second_point = self.rotate(points[0], self.teeth_angle)
        third_point = self.rotate([self.root_radius, 0], (self.teeth_angle) * (3/4) + reference_angle/2)

        print(inverted_points[0], second_point, third_point)
        center, radius = find_circle(
            inverted_points[0][0], inverted_points[0][1], 
            third_point[0], third_point[1],
            second_point[0], second_point[1], 
        )
        '''
        fillet_points = []
        reduction = rad_to_deg(self.teeth_angle / 2)
        print(reduction)
        for i in range(int(90 - reduction)):
            angle = (math.pi * 2 / 360) * i

            point = self.rotate(inverted_points[0], -angle, center=center)
            fillet_points.append(point)

            point = self.rotate(second_point, angle, center=center)
            fillet_points.append(point)
        '''
        print(points[0], inverted_points[0], self.distance(points[0], inverted_points[0]))
        print(points[-1], inverted_points[-1], self.distance(points[-1], inverted_points[-1]))

        inverted_points.reverse()
        points.extend(inverted_points)
        #points.extend(fillet_points)

        self.print_new_image(points)

        return points

    def get_involute_point(self, radius):
        pressure_angle = math.acos(self.base_radius / radius)
        inverse_angle = math.tan(pressure_angle) - pressure_angle

        x = radius * math.cos(inverse_angle)
        y = radius * math.sin(inverse_angle)

        return [x, y]
        
    def distance(self, a, b):
        return math.sqrt(
            math.pow(a[0] - b[0], 2) +
            math.pow(a[1] - b[1], 2)
        )

    def rotate(self, point, angle, center=[0,0]):
        """
        Rotate a point counterclockwise by a given angle around a given origin.

        The angle should be given in radians.
        """
        ox, oy = (center[0], center[1])
        px, py = (point[0], point[1])

        qx = ox + math.cos(angle) * (px - ox) - math.sin(angle) * (py - oy)
        qy = oy + math.sin(angle) * (px - ox) + math.cos(angle) * (py - oy)

        return [qx, qy]

    def print_new_image(self, points, filename='output.png', scale=255):
        new_image = Image.new("RGB", [IMAGE_SCALE, IMAGE_SCALE], (255, 255, 255, 0))

        # Print Circles
        for i in range(360):
            angle = (math.pi * 2 / 360) * i
            new_point = self.rotate([self.radius, 0], angle)
            new_image.putpixel((
                int(new_point[0] * (IMAGE_SCALE / 50) + (IMAGE_SCALE / 2)), 
                int(new_point[1] * (IMAGE_SCALE / 50) + (IMAGE_SCALE / 2))
            ), (0, 0, 0, 1))

            new_point = self.rotate([self.base_radius, 0], angle)
            new_image.putpixel((
                int(new_point[0] * (IMAGE_SCALE / 50) + (IMAGE_SCALE / 2)), 
                int(new_point[1] * (IMAGE_SCALE / 50) + (IMAGE_SCALE / 2))
            ), (0, 0, 0, 1))

            new_point = self.rotate([self.tip_radius, 0], angle)
            new_image.putpixel((
                int(new_point[0] * (IMAGE_SCALE / 50) + (IMAGE_SCALE / 2)), 
                int(new_point[1] * (IMAGE_SCALE / 50) + (IMAGE_SCALE / 2))
            ), (0, 0, 0, 1))

            new_point = self.rotate([self.root_radius, 0], angle)
            new_image.putpixel((
                int(new_point[0] * (IMAGE_SCALE / 50) + (IMAGE_SCALE / 2)), 
                int(new_point[1] * (IMAGE_SCALE / 50) + (IMAGE_SCALE / 2))
            ), (0, 0, 0, 1))

        for point in points:
            for i in range(self.teeth):
                new_point = self.rotate(point, self.teeth_angle * i)

                new_image.putpixel((
                    int(new_point[0] * (IMAGE_SCALE / 50) + (IMAGE_SCALE / 2)), 
                    int(new_point[1] * (IMAGE_SCALE / 50) + (IMAGE_SCALE / 2))
                ), (0, 0, 0, 1))

        for i in range(IMAGE_SCALE):
            new_image.putpixel((int(IMAGE_SCALE / 2), i), (0, 0, 0, 1))
            new_image.putpixel((i, int(IMAGE_SCALE / 2)), (0, 0, 0, 1))

        print('## Creating Image', filename)
        new_image.save('output_images/%s' % (filename))

