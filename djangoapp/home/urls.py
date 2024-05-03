from django.contrib import admin
from django.urls import path, re_path, include

from home.views import *
from basics.views import Index


urlpatterns = [
    path("admin/", admin.site.urls),
    # Users
    path("user/", include("user.urls")),
    # Base API
    path("api/", include("basics.urls")),
    # Catch statements for React
    re_path(r"", Index, name="index"),
]
