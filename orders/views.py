from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework import viewsets, status,serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from deliveryinfo.models import DeliveryInfo
from .models import Order, OrderItem
from carts.models import ShoppingCart
from products.models import Product
from .serializers import OrderSerializer, OrderItemSerializer

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

    @transaction.atomic
    # def perform_create(self, serializer):
    #     try:
    #         cart = ShoppingCart.objects.get(customer=self.request.user)
    #         cart_items = cart.items.all()

    #         # First validate all products have sufficient quantity
    #         for item in cart_items:
    #             if item.product.quantity < item.quantity:
    #                 raise serializers.ValidationError(
    #                     f"Insufficient stock for {item.product.name}. Available: {item.product.quantity}"
    #                 )

    #         order = serializer.save(customer=self.request.user)
    #         total_price = 0

    #         # Process each cart item and update product quantities
    #         for item in cart_items:
    #             # Create order item
    #             order_item = OrderItem.objects.create(
    #                 order=order,
    #                 product=item.product,
    #                 quantity=item.quantity,
    #                 price=item.get_total_price()
    #             )
    #             total_price += order_item.price

    #             # Update product quantity
    #             product = item.product
    #             product.quantity -= item.quantity
    #             product.save()

    #         # Update order total and clear cart
    #         order.total_price = total_price
    #         order.save()
    #         cart.items.all().delete()

        
    #         # Update Sales Data on Order Completion
    #         # for item in order.items.all():
    #         #     ProductSaleHistory.objects.create(
    #         #         product=item.product,
    #         #         sold_quantity=item.quantity
    #         #     )

    @transaction.atomic
    def perform_create(self, serializer):
        try:
            cart = ShoppingCart.objects.get(customer=self.request.user)
            cart_items = cart.items.all()

            if not cart_items:
                raise serializers.ValidationError("Your cart is empty.")

            # ✅ Ensure delivery info exists for this user
            delivery_info = DeliveryInfo.objects.filter(customer=self.request.user).first()
            if not delivery_info:
                raise serializers.ValidationError("❌ You must add delivery information before placing an order.")

            # ✅ Create the order
            order = serializer.save(customer=self.request.user)
            total_price = 0

            # ✅ Process each cart item
            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price,
                )
                total_price += item.product.price * item.quantity

            # ✅ Update order total price & clear cart
            order.total_price = total_price
            order.save()
            cart.items.all().delete()

        except ShoppingCart.DoesNotExist:
            raise serializers.ValidationError("Shopping cart not found.")
        except Exception as e:
            raise serializers.ValidationError(f"Error processing order: {str(e)}")


    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_order_status(self, request, pk=None):
        try:
            order = get_object_or_404(Order, pk=pk)
            new_status = request.data.get('status')

            if not new_status:
                return Response(
                    {'error': 'Status field is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            valid_statuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled']
            if new_status not in valid_statuses:
                return Response(
                    {'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Handle product quantity restoration when cancelling order
            if new_status == 'Cancelled' and order.status != 'Cancelled':
                with transaction.atomic():
                    for order_item in order.items.all():
                        product = order_item.product
                        product.quantity += order_item.quantity
                        product.save()

            order.status = new_status
            order.save()

            serializer = self.get_serializer(order)
            return Response(serializer.data)

        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def order_history(self, request):
        orders = self.get_queryset().order_by('-ordered_at')
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)
        