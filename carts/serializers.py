from rest_framework import serializers
from .models import *

class CartIetmSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'total_price']

class ShoppingCartSerializer(serializers.ModelSerializer):
    items = CartIetmSerializer(many=True,read_only = True)

    class Meta:
        model = ShoppingCart
        fields = '__all__'