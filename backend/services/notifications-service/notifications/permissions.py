from functools import wraps
from django.http import JsonResponse

def admin_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not hasattr(request, 'user_data') or request.user_data.get('role') != 'admin':
            return JsonResponse({'error': 'Admin access required'}, status=403)
        return view_func(request, *args, **kwargs)
    return wrapper

def user_or_admin_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not hasattr(request, 'user_data'):
            return JsonResponse({'error': 'Authentication required'}, status=401)
        return view_func(request, *args, **kwargs)
    return wrapper

class NotificationPermissionMixin:
    def filter_user_notifications(self, queryset):
        user_data = getattr(self.request, 'user_data', {})
        if user_data.get('role') == 'admin':
            return queryset
        return queryset.filter(user=user_data.get('id'))