from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, create_internal_notification

router = DefaultRouter()
router.register(r'', NotificationViewSet, basename='notification')

urlpatterns = [
    path('internal/', create_internal_notification, name='internal-create'),
    path('', include(router.urls)),
]