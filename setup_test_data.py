#!/usr/bin/env python
"""
Setup script to create test data for API testing
Run this after starting services and applying migrations
"""

import os
import sys
import django
from django.contrib.auth import get_user_model
from django.core.management import execute_from_command_line

def setup_users_service():
    """Setup test user in users service"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
    sys.path.append('backend/services/users-service')
    
    try:
        django.setup()
        User = get_user_model()
        
        # Create admin user if doesn't exist
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@test.com',
                password='admin123',
                role='admin'
            )
            print("✅ Admin user created")
        else:
            print("✅ Admin user already exists")
            
        # Create regular user if doesn't exist
        if not User.objects.filter(username='user1').exists():
            User.objects.create_user(
                username='user1',
                email='user1@test.com',
                password='user123',
                role='user'
            )
            print("✅ Regular user created")
        else:
            print("✅ Regular user already exists")
            
    except Exception as e:
        print(f"❌ Error setting up users: {e}")

if __name__ == "__main__":
    print("Setting up test data...")
    setup_users_service()
    print("Test data setup completed!")