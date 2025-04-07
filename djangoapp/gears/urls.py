from django.urls import include, path

from gears.views import CreateGear


urlpatterns = [
    path("create/", CreateGear, name="CreateGear"),
]
