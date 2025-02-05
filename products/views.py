from django.shortcuts import render
from .serializers import *
from .models import *
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated,IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status

class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        category_id = self.request.query_params.get('category_id')
        if category_id:
            return Product.objects.filter(category_id=category_id)
        return Product.objects.all().order_by('-created_at')

    def create(self, request, *args, **kwargs):
        images = request.FILES.getlist('images')
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save()
            for image in images:
                ProductImage.objects.create(product=product, image=image)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            self.perform_update(serializer)
            
            # Handle image updates
            images = request.FILES.getlist('images')
            if images:
                # Delete existing images
                instance.images.all().delete()
                # Create new images
                for image in images:
                    ProductImage.objects.create(product=instance, image=image)
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def trending(self, request):
        # Get the top 10 products by last week's sales
        trending_products = Product.objects.order_by('-last_week_sales')[:10]
        serializer = self.get_serializer(trending_products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        # Get all products marked as featured
        featured_products = Product.objects.filter(is_featured=True)
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)

    


class CategorytViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class RatingtViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Rating.objects.all().order_by('-created_at')
    serializer_class = RatingSerializer

    def get_queryset(self):
        """Filter ratings by product if product_id is passed in query params."""
        product_id = self.request.query_params.get('product_id')
        if product_id:
            return Rating.objects.filter(product_id=product_id)
        return Rating.objects.all()

    def perform_create(self, serializer):
        # ✅ Set the user to the currently logged-in user
        serializer.save(user=self.request.user)

    # (Optional) If you want to enforce only one review per user per product:
    def create(self, request, *args, **kwargs):
        product_id = request.data.get("product")
        existing_rating = Rating.objects.filter(user=request.user, product_id=product_id).first()
        if existing_rating:
            raise serializers.ValidationError("You have already rated this product.")
        return super().create(request, *args, **kwargs)

        # Check if user has already reviewed this product
        existing_rating = Rating.objects.filter(user=user, product_id=product_id).first()
        if existing_rating:
            return Response(
                {"error": "You have already rated this product."},
                status=400
            )

        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Allow users to delete only their own reviews."""
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {"error": "You can only delete your own reviews."},
                status=403
            )
        self.perform_destroy(instance)
        return Response({"message": "Review deleted successfully."}, status=204)