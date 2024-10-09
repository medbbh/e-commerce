from rest_framework import viewsets
from .models import DeliveryInfo
from .serializers import DeliveryInfoSerializer
from rest_framework.permissions import IsAuthenticated

class DeliveryInfoViewSet(viewsets.ModelViewSet):
    queryset = DeliveryInfo.objects.all()
    serializer_class = DeliveryInfoSerializer
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        # Only return the delivery info for the logged-in user
        return DeliveryInfo.objects.filter(customer=self.request.user)

    def perform_create(self, serializer):
        # Automatically associate the customer with the logged-in user
        serializer.save(customer=self.request.user)

    def perform_update(self, serializer):
        # Ensure the customer is always the logged-in user during update
        serializer.save(customer=self.request.user)
