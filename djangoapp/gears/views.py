from django.http import JsonResponse, HttpResponse
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes

from gears.helpers.gears import Gear
from gears.helpers.stl_editor import STLEditor


@api_view(["GET"])
@permission_classes((AllowAny,))
def CreateGear(request):
    gear = Gear(teeth=10, module=1)
    faces = gear.make_gear_faces()
    editor = STLEditor()
    stl_text = editor.output_face_list(face_list=faces)

    filename = "text_object.stl"
    response = HttpResponse(stl_text, content_type="text/plain")
    response["Content-Disposition"] = "attachment; filename={0}".format(filename)

    return response
