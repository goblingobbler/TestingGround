import uuid
from django.db import models


class BaseModel(models.Model):
    class Meta:
        abstract = True

    # Standard UUID
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Soft delete flag
    active = models.BooleanField(default=True)

    # Dates
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def to_json(self):
        return basic_jsonifying(self)


# Generic JSON conversion
def basic_jsonifying(instance):
    data = {}

    fields = type(instance)._meta.fields
    for field in fields:
        if field.get_internal_type() == "DateTimeField":
            if getattr(instance, field.name):
                data[field.name] = getattr(instance, field.name).strftime("%m/%d/%Y")
            else:
                data[field.name] = None

        elif field.get_internal_type() == "ForeignKey":
            data[field.name] = str(getattr(instance, field.name + "_id"))
        else:
            data[field.name] = getattr(instance, field.name)

    return data
