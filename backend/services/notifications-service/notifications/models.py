from django.db import models

class Notification(models.Model):
    user = models.IntegerField()
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)