from django.urls import include, path

from objects.views import CreateGear, CreateVase


urlpatterns = [
    path("create_gear/", CreateGear, name="CreateGear"),
    path("create_vase/", CreateVase, name="CreateVase"),
]
