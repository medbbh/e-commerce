from django.db import models
from users.models import CustomUser as User

class Category(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    description = models.TextField()
    image = models.FileField()
    category_id = models.ForeignKey(Category,on_delete=models.CASCADE)
    count_in_stock = models.IntegerField()
    rating = models.FloatField()
    num_of_reviews = models.IntegerField

    def __str__(self):
        return self.name

class Rating(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    product = models.ForeignKey(Product,on_delete=models.CASCADE,related_name='product_rating')
    comment = models.TextField()
    rating = models.FloatField()

    def __str__(self):
        return self.comment
