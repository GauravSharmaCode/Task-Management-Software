from rest_framework import viewsets, status
from rest_framework.response import Response
from django.core.cache import cache
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    
    def get_queryset(self):
        queryset = Task.objects.all()
        
        if self.request.user_data.get('role') != 'admin':
            queryset = queryset.filter(assigned_user=self.request.user_data.get('id'))
        
        # Filtering
        due_date = self.request.query_params.get('due_date')
        priority = self.request.query_params.get('priority')
        assigned_user = self.request.query_params.get('assigned_user')
        status_filter = self.request.query_params.get('status')
        
        if due_date:
            queryset = queryset.filter(due_date__date=due_date)
        if priority:
            queryset = queryset.filter(priority=priority)
        if assigned_user:
            queryset = queryset.filter(assigned_user=int(assigned_user))
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        task = serializer.save()
        self._broadcast_task_update('task_created', task)
        
    def perform_update(self, serializer):
        task = serializer.save()
        self._broadcast_task_update('task_updated', task)
        
    def perform_destroy(self, instance):
        self._broadcast_task_update('task_deleted', instance)
        instance.delete()
        
    def _broadcast_task_update(self, action, task):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'tasks',
            {
                'type': 'task_update',
                'action': action,
                'task': TaskSerializer(task).data if action != 'task_deleted' else {'id': task.id}
            }
        )