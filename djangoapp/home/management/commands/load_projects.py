from django.core.management.base import BaseCommand, CommandError
from django.db.models import Q, Prefetch, Count, Sum, Avg, Max, F

from home.models import *
from user.models import *

PROJECT_DATA = [
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
        "name": "Walkthrough",
        "url": "https://www.getawalkthrough.com/",
        "image": "static/images/walkthrough.JPG",
    },
    {
        "type": "website",
        "name": "Shed Customizer",
        "url": "http://sheds.millercodes.com/",
        "image": "static/images/sheds.JPG",
    },
    {
        "type": "website",
        "name": "Framed Marketplace",
        "url": "https://www.framedmarketplace.com/",
        "image": "static/images/framedmarketplace.JPG",
    },
    {
        "type": "website",
        "name": "Sponsr",
        "url": "https://sponsr.com/",
        "image": "static/images/sponsr.JPG",
    },
    {
        "type": "website",
        "name": "Dimension 5",
        "url": "https://dimension5documents.com/",
        "image": "static/images/dim5.JPG",
    },
    {
        "type": "website",
        "name": "Happier Traveler",
        "url": "https://happiertraveler.com/",
        "image": "static/images/ht.JPG",
    },
]


class Command(BaseCommand):

    def handle(self, *args, **options):
        Project.objects.all().delete()

        for data in PROJECT_DATA:
            project = Project.objects.filter(name=data["name"]).first()

            if not project:
                project = Project.objects.create(**data)

            print(project.to_json())
