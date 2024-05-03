from django.http import JsonResponse

from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes

from basics.helpers.get_and_set import handle_get_or_set_request
from user.models import User


@api_view(["GET"])
@permission_classes((AllowAny,))
def GetUser(request):
    json_response = {}
    if request.user.is_authenticated:
        json_response = handle_get_or_set_request(
            request,
            User,
            id=request.user.id,
        )

    return JsonResponse(json_response)
