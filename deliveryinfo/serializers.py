from rest_framework import serializers
from .models import DeliveryInfo

class DeliveryInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryInfo
        fields = '__all__'
        read_only_fields = ['customer']