from django.urls import path
from .views import health, favicon, get_classes


urlpatterns = [
    path('', health, name='health'),
    path('favicon.ico', favicon, name='favicon'),
    path('api/classes/', get_classes, name='get_classes'),
]


path('api/classes/', get_classes, name='get_classes'),
path('api/classes/', get_classes, name='get_classes'),
path('api/classes/', get_classes, name='get_classes'),
