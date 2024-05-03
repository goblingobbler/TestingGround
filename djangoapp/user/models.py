import uuid

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
)
from django.db import models

from basics.models import basic_jsonifying


class UserManager(BaseUserManager):
    def create_user(self, email, password, **kwargs):
        email = self.normalize_email(email)
        user = self.model(email=email, **kwargs)
        user.set_password(password)
        user.save(using=self._db)

        return user


class User(AbstractBaseUser):
    # Standard UUID
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Soft delete flag
    active = models.BooleanField(default=True)

    # Dates
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    email = models.EmailField(
        "email address", max_length=254, unique=True, db_index=True
    )

    is_staff = models.BooleanField("staff status", default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"

    def to_json(self):
        return basic_jsonifying(self)
