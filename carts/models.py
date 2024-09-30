from django.db import models
from django.conf import settings
from products.models import Product

class ShoppingCart(models.Model):
    customer = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)

class CartItem(models.Model):
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    cart = models.ForeignKey(ShoppingCart,on_delete=models.CASCADE,related_name='items')
    quantity = models.PositiveIntegerField(default=1)

    def get_total_price(self):
        return self.product.price * self.quantity

