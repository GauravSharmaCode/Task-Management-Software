from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class Notification(models.Model):
    user = models.IntegerField()
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

@receiver(post_save, sender=Notification)
def notification_created(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'notifications_{instance.user}',
            {
                'type': 'notification_message',
                'notification': {
                    'id': instance.id,
                    'message': instance.message,
                    'is_read': instance.is_read,
                    'created_at': instance.created_at.isoformat()
                }
            }
        )