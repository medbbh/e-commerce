from .views import OrderViewSet
from .views import *
from rest_framework.routers import SimpleRouter

router = SimpleRouter()
router.register('', OrderViewSet,basename='order')

urlpatterns = router.urls

