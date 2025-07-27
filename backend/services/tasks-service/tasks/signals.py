import requests
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Task

@receiver(post_save, sender=Task)
def create_task_notification(sender, instance, created, **kwargs):
    if created:
        message = f"New task created: {instance.title}"
    else:
        message = f"Task updated: {instance.title}"
    
    try:
        requests.post(
            "http://notifications-service:8003/api/notifications/internal/",
            json={
                'user': instance.assigned_user,
                'message': message
            },
            timeout=5
        )
    except:
        pass  # Fail silently if notifications service is down