from rest_framework import viewsets
from .models import Order, OrderItem
from carts.models import ShoppingCart, CartItem
from .serializers import OrderSerializer, OrderItemSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user)

    def perform_create(self, serializer):

        cart = ShoppingCart.objects.get_or_create(customer=self.request.user)
        
        order = serializer.save(customer=self.request.user)

        total_price = 0
        cart_items = cart.items.all()
        for item in cart_items:
            order_item = OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.get_total_price()
            )
            total_price += order_item.price

        order.total_price = total_price
        order.save()
        cart.items.all().delete()

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')

        if new_status not in ['Pending', 'Shipped', 'Delivered', 'Cancelled']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        order.status = new_status
        order.save()
        return Response({'status': f"Order status updated to {order.status}"})

    # This is for retrieving the user's order history
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def order_history(self, request):
        orders = self.get_queryset()
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)