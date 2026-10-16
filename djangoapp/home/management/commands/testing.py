import os

from django.conf import settings
from django.core.management.base import BaseCommand

from objects.helpers.puzzle import Puzzle
from objects.helpers.stl_editor import STLEditor

class Command(BaseCommand):

    def handle(self, *args, **options):
        puzzle = Puzzle()
        editor = STLEditor()

        outer = puzzle.make_outer_cylinder()
        stl_text = editor.output_face_list(outer)

        filepath = os.path.join(settings.BASE_DIR, f"home/output/test.stl")
        with open(filepath, "w", newline="") as file:
            file.write(stl_text)
