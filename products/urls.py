from django.contrib import admin
from django.urls import path,include
from .views import *
from rest_framework.routers import SimpleRouter

router = SimpleRouter()

router.register('categories', CategorytViewSet,basename='category')
router.register('rating', RatingtViewSet,basename='rating')
router.register('', ProductViewSet,basename='product')

urlpatterns = router.urls
