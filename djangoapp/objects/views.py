from django.http import JsonResponse, HttpResponse
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes

from objects.helpers.gear import Gear
from objects.helpers.vase import Vase
from objects.helpers.stl_editor import STLEditor


@api_view(["POST"])
@permission_classes((AllowAny,))
def CreateGear(request):
    json_data = request.data

    print(json_data)

    gear = Gear(
        teeth=int(json_data.get("teeth", 10)),
        module=float(json_data.get("module", 1)),
    )

    editor = STLEditor()
    stl_text = editor.output_face_list(face_list=gear.build())

    filename = "text_object.stl"
    response = HttpResponse(stl_text, content_type="text/plain")
    response["Content-Disposition"] = "attachment; filename={0}".format(filename)

    return response


@api_view(["POST"])
@permission_classes((AllowAny,))
def CreateVase(request):
    json_data = request.data

    print(json_data)

    vase = Vase()
    editor = STLEditor()

    if json_data["type"] == "helix":
        stl_text = editor.output_face_list(face_list=vase.simple_helix_vase())
    elif json_data["type"] == "bulb":
        stl_text = editor.output_face_list(face_list=vase.simple_bulb_vase())
    elif json_data["type"] == "braided":
        stl_text = editor.output_face_list(face_list=vase.simple_braided_vase())

    filename = "text_object.stl"
    response = HttpResponse(stl_text, content_type="text/plain")
    response["Content-Disposition"] = "attachment; filename={0}".format(filename)

    return response
