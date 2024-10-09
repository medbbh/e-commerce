from django.db import models
from django.conf import settings

class DeliveryInfo(models.Model):
    customer = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.IntegerField()
    wtsp = models.IntegerField(blank=True, null=True)
    city = models.CharField(max_length=100)
    street = models.CharField(max_length=100)
    current_location = models.CharField(max_length=100,blank=True,null=True)

    def __str__(self):
            return f"{self.street}, {self.city}"