# users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    AdminUserViewSet
)

# 1) Register the admin user viewset
router = DefaultRouter()
# We'll register it under "admin-users" to avoid clashing with Djoser’s "users/"
router.register(r'admin-users', AdminUserViewSet, basename='admin-users')

urlpatterns = [
    # 2) Include Djoser default endpoints
    path('', include('djoser.urls')),  
    # 3) Include Djoser’s JWT endpoints (like /jwt/create, /jwt/refresh, etc.)
    path('', include('djoser.urls.jwt')),

    # 4) Overwrite token create if you want a custom claims
    path('jwt/create/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 5) Add the admin router
    path('', include(router.urls)),
]
