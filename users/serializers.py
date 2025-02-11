from django.contrib.auth import get_user_model
from djoser.serializers import UserSerializer  # from Djoser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # custom claims to the token
        token['role'] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Include user info in the response
        data['role'] = self.user.role
        return data

class CustomUserSerializer(UserSerializer):
    """
    Extending Djoser's UserSerializer or just a normal ModelSerializer
    if you prefer. Make sure it includes 'role'.
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'username', 'role']
        # Exclude or read_only_fields if necessary
