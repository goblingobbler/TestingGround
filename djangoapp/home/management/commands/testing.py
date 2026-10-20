import os

from django.conf import settings
from django.core.management.base import BaseCommand

from objects.helpers.puzzle import Puzzle
from objects.helpers.stl_editor import STLEditor

DEBUG_PUZZLE = [
    ["blank", "blank", "blank", "blank"],
    ["blank", "blank", "blank", "blank"],
    ["blank", "blank", "blank", "blank"],
    ["blank", "blank", "blank", "blank"],
    ["blank", "center", "blank", "center"],
]

TEST_PUZZLE = [
    ["blank", "up_down_right", "horizontal", "blank"],
    ["down_right", "up_left", "blank", "blank"],
    ["vertical", "blank", "blank", "blank"],
    ["up_left", "blank", "blank", "down_left_right"],
    ["blank", "blank", "down_right", "up_left"],
]


class Command(BaseCommand):

    def handle(self, *args, **options):
        puzzle = Puzzle()
        editor = STLEditor()

        paths = DEBUG_PUZZLE
        faces = puzzle.build_puzzle(paths)
        stl_text = editor.output_face_list(faces)

        filepath = os.path.join(settings.BASE_DIR, f"home/output/test.stl")
        with open(filepath, "w", newline="") as file:
            file.write(stl_text)
