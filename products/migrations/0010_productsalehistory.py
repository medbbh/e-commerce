# Generated by Django 5.1.1 on 2024-11-15 10:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0009_product_average_rating'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProductSaleHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sold_quantity', models.IntegerField()),
                ('sale_date', models.DateTimeField(auto_now_add=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sales_history', to='products.product')),
            ],
        ),
    ]
