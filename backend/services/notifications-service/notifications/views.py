from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Notification
from .serializers import NotificationSerializer
from .permissions import NotificationPermissionMixin

class NotificationViewSet(NotificationPermissionMixin, viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    
    def get_queryset(self):
        queryset = Notification.objects.all()
        return self.filter_user_notifications(queryset).order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def create_internal_notification(request):
    try:
        Notification.objects.create(
            user=request.data['user'],
            message=request.data['message']
        )
        return Response({'status': 'created'}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)