import uuid
from django.db import models
from django.conf import settings

class StoredFile(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='files')
    original_name = models.CharField(max_length=1024)
    stored_name = models.CharField(max_length=1024, unique=True)
    size = models.BigIntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    last_downloaded_at = models.DateTimeField(null=True, blank=True)
    comment = models.TextField(blank=True)
    path = models.CharField(max_length=2048)
    public_link = models.UUIDField(default=uuid.uuid4, unique=True)

    def __str__(self):
        return f"{self.original_name} ({self.owner.username})"
