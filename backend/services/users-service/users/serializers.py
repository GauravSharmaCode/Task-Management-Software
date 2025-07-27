from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        """
    Validate the provided username and password.

    This method authenticates the user with the given credentials.
    If the user is found and is active, the user object is returned.
    Otherwise, a ValidationError is raised indicating invalid credentials.

    Args:
        data (dict): A dictionary containing 'username' and 'password' keys.

    Returns:
        User: The authenticated user object if credentials are valid.

    Raises:
        serializers.ValidationError: If the authentication fails or user is inactive.
        """
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")