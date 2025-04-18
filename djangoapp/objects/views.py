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
        width=float(json_data.get("width", 2)),
        xy_inset=float(json_data.get("xy_inset", 0)),
        z_inset=float(json_data.get("z_inset", 0)),
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

    parsed_data = []
    for item in json_data["helix_list"]:
        for key in item:
            if item[key] == "":
                item[key] = 0
            item[key] = float(item[key])
        parsed_data.append(item)

    faces = vase.custom_vase(helix_data=parsed_data)

    stl_text = ""
    if len(faces) > 0:
        stl_text = editor.output_face_list(face_list=faces)

    filename = "text_object.stl"
    response = HttpResponse(stl_text, content_type="text/plain")
    response["Content-Disposition"] = "attachment; filename={0}".format(filename)

    print("CreateVase Complete")

    return response
