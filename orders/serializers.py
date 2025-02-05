from rest_framework import serializers

from deliveryinfo.models import DeliveryInfo
from deliveryinfo.serializers import DeliveryInfoSerializer
from .models import *

class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.StringRelatedField()

    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    delivery_info = serializers.SerializerMethodField()  
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = ['id', 'customer', 'ordered_at', 'status', 'total_price', 'items','delivery_info']
        read_only_fields = ['customer']

    # ✅ Fetch delivery info dynamically
    def get_delivery_info(self, obj):
        delivery_info = DeliveryInfo.objects.filter(customer=obj.customer).first()
        return DeliveryInfoSerializer(delivery_info).data if delivery_info else None