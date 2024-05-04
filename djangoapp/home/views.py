from django.http import JsonResponse
from django.shortcuts import render

from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes

from basics.helpers.get_and_set import handle_get_or_set_request
from home.models import Project


@api_view(["GET"])
@permission_classes((AllowAny,))
def GetProjects(request):
    parameters = request.GET.dict()

    json_response = handle_get_or_set_request(
        request,
        Project,
        list_query=Project.objects.filter(**parameters).order_by("-created_at"),
    )

    return JsonResponse(json_response, safe=False)


def checkers(request):
    return render(request, "checkers.html", {})


def circles(request):
    return render(request, "circles.html", {})


def clock(request):
    return render(request, "clock.html", {})


def colors(request):
    return render(request, "colors.html", {})


def rtsDemo(request):
    return render(request, "rts-demo.html", {})


def solarSystem(request):
    return render(request, "solar-system.html", {})
