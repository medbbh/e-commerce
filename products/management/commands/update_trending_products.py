from django.core.management.base import BaseCommand
from products.models import Product

class Command(BaseCommand):
    help = 'Updates the last week sales for trending products'

    def handle(self, *args, **options):
        Product.update_trending_products()
        self.stdout.write(self.style.SUCCESS('Successfully updated trending products'))