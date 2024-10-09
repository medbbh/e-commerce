from .views import *
from .views import *
from rest_framework.routers import SimpleRouter

router = SimpleRouter()
router.register('', DeliveryInfoViewSet, basename='deliveryinfo')

urlpatterns = router.urls



