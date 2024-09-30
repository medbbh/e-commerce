from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import *
from .serializers import *

class ShoppingCartViewSet(viewsets.ModelViewSet):
    queryset = ShoppingCart.objects.all()
    serializer_class = ShoppingCartSerializer

    def get_queryset(self):
        return ShoppingCart.objects.filter(customer=self.request.user)

class CartItemViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = CartItem.objects.all()
    serializer_class = CartIetmSerializer

    def get_queryset(self):
        return CartItem.objects.filter(cart__customer=self.request.user)

    def perform_create(self, serializer):
        cart, created = ShoppingCart.objects.get_or_create(customer=self.request.user)
        serializer.save(cart=cart)

