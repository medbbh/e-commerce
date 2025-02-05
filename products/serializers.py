from rest_framework import serializers
from .models import *
from users.serializers import UserSerializer

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['image']
class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, required=False)
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'description', 'category_id', 'images', 'count_in_stock', 'rating', 'num_of_reviews', 'is_featured', 'created_at']

    def create(self, validated_data):
        images_data = self.context['request'].FILES.getlist('images')
        product = Product.objects.create(**validated_data)
        for image_data in images_data:
            ProductImage.objects.create(product=product, image=image_data)
        return product
    
class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True, source='product_set')

    class Meta:
        model = Category
        fields = ['id','name','products']

class RatingSerializer(serializers.ModelSerializer):
    # user = serializers.StringRelatedField(default=serializers.CurrentUserDefault(), read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Rating
        fields = '__all__'