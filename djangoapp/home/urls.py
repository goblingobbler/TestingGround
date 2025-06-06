from django.contrib import admin
from django.urls import path, re_path, include
from django.shortcuts import render

from home.views import *
from basics.views import Index


urlpatterns = [
    path("admin/", admin.site.urls),
    # Users
    path("user/", include("user.urls")),
    # Custom API
    path("api/get_projects/", GetProjects, name="GetProjects"),
    # Base API
    path("api/", include("basics.urls")),
    # Gear API
    path("api/objects/", include("objects.urls")),
    # Random Projects
    path("checkers", checkers, name="checkers"),
    path("circles", circles, name="circles"),
    path("clock", clock, name="clock"),
    path("colors", colors, name="colors"),
    path("rts-demo", rtsDemo, name="rtsDemo"),
    path("solar-system", solarSystem, name="solarSystem"),
    # Catch statements for React
    re_path(r"", Index, name="index"),
]
