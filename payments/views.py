# payments/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.conf import settings
import stripe
from carts.models import ShoppingCart
from payments.models import Payment

# Set your Stripe secret key
stripe.api_key = settings.STRIPE_SECRET_KEY

class CreatePaymentIntentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user

        # Retrieve user's shopping cart
        try:
            cart = ShoppingCart.objects.get(customer=user)
        except ShoppingCart.DoesNotExist:
            return Response({"error": "Shopping cart not found."},
                            status=status.HTTP_400_BAD_REQUEST)

        cart_items = cart.items.all()
        if not cart_items:
            return Response({"error": "Your cart is empty."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Calculate total amount (assuming product.price is in USD)
        total_amount = sum(item.product.price * item.quantity for item in cart_items)
        total_amount_cents = int(total_amount * 100)

        try:
            # Create a PaymentIntent with Stripe
            intent = stripe.PaymentIntent.create(
                amount=total_amount_cents,
                currency='usd',
                payment_method_types=['card'],
                metadata={'user_id': user.id},
            )
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Save the Payment record with status "pending"
        payment = Payment.objects.create(
            customer=user,
            stripe_payment_intent_id=intent.id,
            amount=total_amount,
            status="pending",
        )

        return Response({
            "clientSecret": intent.client_secret,
            "paymentId": payment.id,
            "amount": total_amount,
        })
