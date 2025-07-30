from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('verify/', views.verify_token, name='verify_token'),
    path('users/', views.list_users, name='list_users'),
    path('users/<int:user_id>/role/', views.update_user_role, name='update_user_role'),
]