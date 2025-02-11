# from django.conf import settings
# from django.shortcuts import get_object_or_404
# from django.db import transaction
# from rest_framework import viewsets, status,serializers
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.decorators import action
# from rest_framework.response import Response
# import stripe
# from rest_framework.views import APIView

# from deliveryinfo.models import DeliveryInfo
# from .models import Order, OrderItem
# from carts.models import ShoppingCart
# from products.models import Product
# from .serializers import OrderSerializer, OrderItemSerializer


# # Set your secret key
# stripe.api_key = settings.STRIPE_SECRET_KEY

# class CreateCheckoutSessionView(APIView):
#     def post(self, request, *args, **kwargs):
#         order_id = request.data.get("order_id")
#         if not order_id:
#             return Response({"error": "Order ID not provided."}, status=status.HTTP_400_BAD_REQUEST)

#         # Make sure the order exists and belongs to the current user
#         order = get_object_or_404(Order, id=order_id, customer=request.user)

#         # Build line items from the order's items.
#         # (Assuming your Order model has a related name "items" for its OrderItem objects)
#         line_items = []
#         for item in order.items.all():
#             line_items.append({
#                 'price_data': {
#                     'currency': 'usd',  # or your preferred currency
#                     'product_data': {
#                         'name': item.product.name,
#                     },
#                     'unit_amount': int(item.price * 100),  # Stripe expects amounts in cents
#                 },
#                 'quantity': item.quantity,
#             })

#         try:
#             checkout_session = stripe.checkout.Session.create(
#                 payment_method_types=['card'],
#                 line_items=line_items,
#                 mode='payment',
#                 # Replace these URLs with your frontend’s URLs
#                 success_url='http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
#                 cancel_url='http://localhost:3000/cancel',
#             )
#             return Response({"sessionId": checkout_session.id})
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class OrderViewSet(viewsets.ModelViewSet):
#     queryset = Order.objects.all()
#     serializer_class = OrderSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Order.objects.filter(customer=self.request.user).order_by('-ordered_at')
    
#     @action(detail=False, methods=['get'], url_path='all-orders')
#     def all_orders(self, request):
#         orders = Order.objects.all().order_by('-ordered_at')
#         serializer = self.get_serializer(orders, many=True)
#         return Response(serializer.data)

#     @transaction.atomic
#     def perform_create(self, serializer):
#         try:
#             cart = ShoppingCart.objects.get(customer=self.request.user)
#             cart_items = cart.items.all()

#             if not cart_items:
#                 raise serializers.ValidationError("Your cart is empty.")

#             # Ensure delivery info exists for this user
#             delivery_info = DeliveryInfo.objects.filter(customer=self.request.user).first()
#             if not delivery_info:
#                 raise serializers.ValidationError("❌ You must add delivery information before placing an order.")

#             # Create the order
#             order = serializer.save(customer=self.request.user)
#             total_price = 0

#             # Process each cart item and update product stock
#             for item in cart_items:
#                 product = item.product

#                 # Check for sufficient stock
#                 # if item.product.quantity < item.quantity:
#                 #     raise serializers.ValidationError(
#                 #         f"Insufficient stock for {item.product.name}. Available: {item.product.quantity}"
#                 #     )
#                             # Check if there is enough stock using count_in_stock
#                 if product.count_in_stock < item.quantity:
#                     raise serializers.ValidationError(
#                         f"Insufficient stock for {product.name}. Available: {product.count_in_stock}"
#                     )
                
#                 # Create order item
#                 OrderItem.objects.create(
#                     order=order,
#                     product=item.product,
#                     quantity=item.quantity,
#                     price=item.product.price,
#                 )
#                 total_price += item.product.price * item.quantity

#                 # Update product quantity
#                 product.count_in_stock -= item.quantity
#                 product.save()

#             # Update order total price & clear cart
#             order.total_price = total_price
#             order.save()
#             cart.items.all().delete()

#         except ShoppingCart.DoesNotExist:
#             raise serializers.ValidationError("Shopping cart not found.")
#         except Exception as e:
#             raise serializers.ValidationError(f"Error processing order: {str(e)}")



#     @action(detail=True, methods=['patch'], url_path='update-status')
#     def update_order_status(self, request, pk=None):
#         try:
#             order = get_object_or_404(Order, pk=pk)
#             new_status = request.data.get('status')

#             if not new_status:
#                 return Response(
#                     {'error': 'Status field is required'}, 
#                     status=status.HTTP_400_BAD_REQUEST
#                 )

#             valid_statuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled']
#             if new_status not in valid_statuses:
#                 return Response(
#                     {'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )

#             # Handle product quantity restoration when cancelling order
#             if new_status == 'Cancelled' and order.status != 'Cancelled':
#                 with transaction.atomic():
#                     for order_item in order.items.all():
#                         product = order_item.product
#                         product.count_in_stock += order_item.quantity  # Use count_in_stock here
#                         product.save()

#             order.status = new_status
#             order.save()

#             serializer = self.get_serializer(order)
#             return Response(serializer.data)

#         except Order.DoesNotExist:
#             return Response(
#                 {'error': 'Order not found'}, 
#                 status=status.HTTP_404_NOT_FOUND
#             )
#         except Exception as e:
#             return Response(
#                 {'error': str(e)}, 
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )


#     @action(detail=False, methods=['get'])
#     def order_history(self, request):
#         orders = self.get_queryset().order_by('-ordered_at')
#         serializer = self.get_serializer(orders, many=True)
#         return Response(serializer.data)
        


# orders/views.py
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework import viewsets, status, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
import stripe

from deliveryinfo.models import DeliveryInfo
from .models import Order, OrderItem
from carts.models import ShoppingCart
from products.models import Product
from .serializers import OrderSerializer
from payments.models import Payment

stripe.api_key = settings.STRIPE_SECRET_KEY

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user).order_by('-ordered_at')

    @action(detail=False, methods=['post'], url_path='finalize-order')
    @transaction.atomic
    def finalize_order(self, request):
        """
        Finalize the order after payment is confirmed.
        Expects "payment_id" in the request data.
        """
        payment_id = request.data.get("payment_id")
        if not payment_id:
            return Response({"error": "Payment ID is required."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            payment = Payment.objects.get(id=payment_id, customer=request.user)
        except Payment.DoesNotExist:
            return Response({"error": "Payment not found."},
                            status=status.HTTP_404_NOT_FOUND)

        # Retrieve PaymentIntent status from Stripe
        try:
            intent = stripe.PaymentIntent.retrieve(payment.stripe_payment_intent_id)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if intent.status != "succeeded":
            return Response({"error": "Payment not successful."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Verify there is a shopping cart with items
        try:
            cart = ShoppingCart.objects.get(customer=request.user)
        except ShoppingCart.DoesNotExist:
            return Response({"error": "Shopping cart not found."},
                            status=status.HTTP_400_BAD_REQUEST)

        cart_items = cart.items.all()
        if not cart_items:
            return Response({"error": "Your cart is empty."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Ensure delivery info exists for this user
        delivery_info = DeliveryInfo.objects.filter(customer=request.user).first()
        if not delivery_info:
            return Response({"error": "Delivery information is missing."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Create the order now that payment is confirmed
        order = Order.objects.create(
            customer=request.user,
            total_price=0,  # will be updated below,
            payment=payment
        )
        total_price = 0

        # Process each cart item and update product stock
        for item in cart_items:
            product = item.product
            if product.count_in_stock < item.quantity:
                return Response(
                    {"error": f"Insufficient stock for {product.name}. Available: {product.count_in_stock}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item.quantity,
                price=product.price,
            )
            total_price += product.price * item.quantity

            product.count_in_stock -= item.quantity
            product.save()

        order.total_price = total_price
        order.save()

        # Clear the shopping cart
        cart.items.all().delete()

        # Update payment record status if desired
        payment.status = "succeeded"
        payment.save()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
