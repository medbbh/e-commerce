from django.shortcuts import get_object_or_404
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
        return Order.objects.filter(customer=self.request.user).order_by('-ordered_at')
    
    @action(detail=False, methods=['get'], url_path='all-orders')
    def all_orders(self, request):
        orders = Order.objects.all().order_by('-ordered_at')
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):

        cart = ShoppingCart.objects.get(customer=self.request.user)
        
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

    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_order_status(self, request, pk=None):
        try:
            # Get the order by pk without user restrictions
            order = get_object_or_404(Order, pk=pk)  # This will allow any user to fetch any order

            new_status = request.data.get('status')

            if not new_status:
                return Response({'error': 'Status field is required'}, status=status.HTTP_400_BAD_REQUEST)

            # Validate the status
            valid_statuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled']
            if new_status not in valid_statuses:
                return Response(
                    {'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Update the order status
            order.status = new_status
            order.save()

            # Serialize and return the updated order
            serializer = self.get_serializer(order)
            return Response(serializer.data)

        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    # This is for retrieving the user's order history
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def order_history(self, request):
        orders = self.get_queryset().order_by('-ordered_at')
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)