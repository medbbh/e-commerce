from django.contrib.auth import get_user_model
from django.utils.timezone import now
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    CustomTokenObtainPairSerializer,
    CustomUserSerializer  # our user serializer for admin 
)

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class AdminUserViewSet(viewsets.ModelViewSet):
    """
    Admin-only user management:
    - GET /users/ (list)
    - GET /users/<id>/ (retrieve)
    - PATCH /users/<id>/ (partial update)
    - PATCH /users/<id>/update-role/ (custom action)
    - etc.

    * Requires is_admin.
    """
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]  # Only admins can access

    @action(detail=True, methods=['patch'], url_path='update-role')
    def update_role(self, request, pk=None):
        """
        PATCH /users/<pk>/update-role/
        Body: { "role": "new_role_value" }

        Example: "role": "admin", "role": "manager", etc.
        """
        user = self.get_object()
        new_role = request.data.get('role', None)
        if not new_role:
            return Response({"detail": "Role field is required."},
                            status=status.HTTP_400_BAD_REQUEST)

        user.role = new_role  # Adjust if your User model stores role differently
        user.save()
        return Response({"detail": f"Role updated to '{new_role}' for user #{user.id}."})
