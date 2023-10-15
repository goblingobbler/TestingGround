

class STLEditor():
    def __init__(self, point_lists):
        self.point_lists = point_lists

    def output_file(self):
        faces = []
        for points in self.point_lists:
            for i in range(len(points.pixels)):
                point = points.pixels[i]
                if i == len(points.pixels) - 1:
                    next_point = points.pixels[0]
                else:
                    next_point = points.pixels[i+1]

                verticies = []
                verticies.append("""
    vertex %s %s 0.0""" % (point[0], point[1]))
                verticies.append("""
    vertex %s %s 0.0""" % (next_point[0], next_point[1]))

                face = """
    facet normal 0.0 0.0 1.0
    outer loop
        vertex 0 0 100
    %s
    endloop
    endfacet""" % (''.join(verticies))
                faces.append(face)

        contents = """
solid test-object
%s
endsolid test-object""" % (''.join(faces))
        
        #print(contents)
        with open('test_object.stl', 'w') as f:
            f.write(contents)