from rest_framework import viewsets
from .models import DeliveryInfo
from .serializers import DeliveryInfoSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

class DeliveryInfoViewSet(viewsets.ModelViewSet):
    queryset = DeliveryInfo.objects.all()
    serializer_class = DeliveryInfoSerializer
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        # Only return the delivery info for the logged-in user
        return DeliveryInfo.objects.filter(customer=self.request.user)

    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[^/.]+)')
    def get_delivery_info_by_user(self, request, user_id=None):
        # Fetch the delivery info by user ID
        try:
            delivery_info = DeliveryInfo.objects.get(customer__id=user_id)
            serializer = self.get_serializer(delivery_info)
            return Response(serializer.data)
        except DeliveryInfo.DoesNotExist:
            return Response({"detail": "Delivery info not found."}, status=404)

    def perform_create(self, serializer):
        # Automatically associate the customer with the logged-in user
        serializer.save(customer=self.request.user)

    def perform_update(self, serializer):
        # Ensure the customer is always the logged-in user during update
        serializer.save(customer=self.request.user)
