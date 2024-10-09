from djoser.serializers import UserSerializer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims (fields you want to include in the token)
        token['email'] = user.email
        token['name'] = user.name
        token['username'] = user.username
        token['role'] = user.role

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Add extra fields to the response object along with the token
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'name': self.user.name,
            'username': self.user.username,
            'role': self.user.role
        }

        return data
    
class CustomUserSerializer(UserSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'username', 'role']

