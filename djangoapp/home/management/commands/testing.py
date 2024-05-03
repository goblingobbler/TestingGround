from django.core.management.base import BaseCommand, CommandError
from django.db.models import Q, Prefetch, Count, Sum, Avg, Max, F

from home.models import *
from user.models import *


class Command(BaseCommand):

    def handle(self, *args, **options):
        user = User.objects.get(
            email="dmiller89@gmail.com",
        )
        user.is_staff = True
        user.set_password("admin")
        user.save()

        print(user)
