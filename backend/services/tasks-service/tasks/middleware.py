import requests
from django.conf import settings
from django.http import JsonResponse

class AuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/api/'):
            token = request.META.get('HTTP_AUTHORIZATION')
            if token and token.startswith('Token '):
                token = token.split(' ')[1]
                try:
                    response = requests.get(
                        f"{settings.USERS_SERVICE_URL}/api/auth/verify/",
                        headers={'Authorization': f'Token {token}'}
                    )
                    if response.status_code == 200:
                        request.user_data = response.json()
                    else:
                        return JsonResponse({'error': 'Invalid token'}, status=401)
                except:
                    return JsonResponse({'error': 'Auth service unavailable'}, status=503)
            else:
                return JsonResponse({'error': 'Token required'}, status=401)
        
        return self.get_response(request)