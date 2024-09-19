from django.core.management.base import BaseCommand, CommandError
from django.db.models import Q, Prefetch, Count, Sum, Avg, Max, F

from home.models import *
from user.models import *

OLD_PROJECT_DATA = [
    {
        "type": "website",
        "name": "Shrinkjet",
        "url": "https://web.archive.org/web/20150502205248/http://shrinkjet.dmiller89.webfactional.com:80/",
        "image": "static/images/shrinkjet.png",
    },
    {
        "type": "website",
        "name": "Lasteats",
        "url": "https://web.archive.org/web/20150125022225/http://beta.lasteats.com:80/",
        "image": "static/images/lasteats.png",
    },
    {
        "type": "website",
        "name": "Novatorz",
        "url": "https://web.archive.org/web/20160305034435/http://novatorz.com",
        "image": "static/images/novatorz.png",
    },
    {
        "type": "website",
        "name": "Tutorspark.io",
        "url": "https://web.archive.org/web/20150331030851/http://tutorspark.io",
        "image": "static/images/tutorspark.png",
    },
    {
        "type": "website",
        "name": "Infikno",
        "url": "https://web.archive.org/web/20160314042411/http://infikno.com",
        "image": "static/images/infikno.png",
    },
    {
        "type": "website",
        "name": "Rumor 2 Release",
        "url": "",
        "image": "static/images/rumor2release.png",
    },
    {
        "type": "website",
        "name": "Framed Marketplace",
        "url": "",
        "image": "static/images/framedmarketplace.JPG",
    },
    {
        "type": "website",
        "name": "Sponsr",
        "url": "",
        "image": "static/images/sponsr.JPG",
    },
    {
        "type": "website",
        "name": "Happier Traveler",
        "url": "",
        "image": "static/images/ht.JPG",
    },
    {
        "type": "website",
        "name": "Walkthrough",
        "url": "",
        "image": "static/images/walkthrough.JPG",
    },
]

PROJECT_DATA = [
    {
        "type": "website",
        "name": "Shed Customizer",
        "url": "http://sheds.millercodes.com/",
        "image": "static/images/sheds.JPG",
    },
    {
        "type": "website",
        "name": "Dimension 5",
        "url": "https://dimension5documents.com/",
        "image": "static/images/dim5.JPG",
    },
    {
        "type": "website",
        "name": "MathAnex",
        "url": "https://mathanex.com/",
        "image": "static/images/mathanex.png",
    },
    {
        "type": "website",
        "name": "ForgottenMaps",
        "url": "https://forgottenmaps.com/",
        "image": "static/images/forgottenmaps.png",
    },
]


class Command(BaseCommand):

    def handle(self, *args, **options):
        Project.objects.all().delete()

        for data in OLD_PROJECT_DATA:
            data["live"] = False

            project = Project.objects.filter(name=data["name"]).first()

            if not project:
                project = Project.objects.create(**data)

            print(project.to_json())

        for data in PROJECT_DATA:
            data["live"] = True

            project = Project.objects.filter(name=data["name"]).first()

            if not project:
                project = Project.objects.create(**data)

            print(project.to_json())
