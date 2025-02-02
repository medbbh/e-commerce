from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import *

router = SimpleRouter()

router.register('', DashboardViewSet, basename='dashboard')

urlpatterns = router.urls
