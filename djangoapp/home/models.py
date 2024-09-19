from django.db import models

from basics.models import BaseModel


class Project(BaseModel):
    type = models.CharField(max_length=200, blank=True, default="")
    name = models.CharField(max_length=200, blank=True, default="")

    url = models.CharField(max_length=1000, blank=True, default="")
    image = models.CharField(max_length=1000, blank=True, default="")

    live = models.BooleanField(default=True)
