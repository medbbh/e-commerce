from rest_framework import serializers

# Serializer for Sales Trends (Line Chart)
class SalesTrendSerializer(serializers.Serializer):
    labels = serializers.ListField(child=serializers.CharField())
    sales = serializers.ListField(child=serializers.FloatField())

# Serializer for Top Products
class TopProductSerializer(serializers.Serializer):
    product_name = serializers.CharField()
    quantity_sold = serializers.IntegerField()

# Serializer for Marketing Effectiveness
class MarketingEffectivenessSerializer(serializers.Serializer):
    visitors_today = serializers.IntegerField()

# Serializer for Recent Orders
class RecentOrderSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    total_price = serializers.FloatField()
    status = serializers.CharField()
