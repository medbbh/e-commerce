from django.db import models
from users.models import CustomUser as User
from django.utils import timezone
from django.db.models import Count
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    description = models.TextField()
    category_id = models.ForeignKey(Category,on_delete=models.CASCADE)
    count_in_stock = models.IntegerField()
    rating = models.FloatField(default=0)
    average_rating = models.FloatField(default=0.0)
    num_of_reviews = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    total_sales = models.IntegerField(default=0)
    last_week_sales = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
    @classmethod
    def update_trending_products(cls):
        from orders.models import Order  # Import here to avoid circular import
        
        # Calculate sales for the last week
        one_week_ago = timezone.now() - timezone.timedelta(days=7)
        recent_orders = Order.objects.filter(ordered_at__gte=one_week_ago)
        
        # Count sales for each product
        product_sales = recent_orders.values('items__product').annotate(
            total_sales=Count('items__product')
        )
        
        # Update last_week_sales for each product
        for sale in product_sales:
            product = cls.objects.get(id=sale['items__product'])
            product.last_week_sales = sale['total_sales']
            product.save()

    def update_rating(self):
        # Calculate the average rating based on all associated ratings
        ratings = self.product_rating.all()
        if ratings.exists():
            self.average_rating = ratings.aggregate(models.Avg('rating'))['rating__avg']
        else:
            self.average_rating = 0.0
        self.save()

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='media/', blank=True, null=True)

    def __str__(self):
        return f"Image for {self.product.name}"
    
    
class Rating(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    product = models.ForeignKey(Product,on_delete=models.CASCADE,related_name='product_rating')
    comment = models.TextField()
    rating = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"Review by {self.user.username} for {self.product.name}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.product.update_rating()
