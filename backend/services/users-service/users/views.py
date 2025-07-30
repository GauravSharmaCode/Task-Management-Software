from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import LoginSerializer, UserSerializer, RegisterSerializer
from .permissions import admin_required
from .models import User

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout(request):
    request.user.auth_token.delete()
    return Response({'message': 'Logged out successfully'})

@api_view(['GET'])
def verify_token(request):
    if 'Authorization' not in request.headers:
        return Response({'message': 'No token provided'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)

@api_view(['GET'])
@admin_required
def list_users(request):
    users = User.objects.all()
    return Response(UserSerializer(users, many=True).data, status=status.HTTP_200_OK)

@api_view(['PUT'])
@admin_required
def update_user_role(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        role = request.data.get('role')
        if role in ['admin', 'user']:
            user.role = role
            user.save()
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid role'}, status=400)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    
@api_view(['DELETE'])
@admin_required
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        instance = user
        instance.is_active = False  # Soft delete
        instance.save()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)