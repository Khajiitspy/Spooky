from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    # path('register/', RegisterUserView.as_view(), name='register'),
    path('', include(router.urls)),
]
