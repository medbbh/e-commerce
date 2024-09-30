from django.contrib import admin
from django.urls import path,include
from .views import *
from rest_framework.routers import SimpleRouter

router = SimpleRouter()

router.register('carts/', ShoppingCartViewSet,basename='shopping-cart')
router.register('', CartItemViewSet,basename='cart')

urlpatterns = router.urls
