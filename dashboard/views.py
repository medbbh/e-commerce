# from django.db.models import Count, Sum
# from django.utils.timezone import now
# from rest_framework import viewsets
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from products.models import Product
# from orders.models import Order, OrderItem
# from products.serializers import ProductSerializer
# from orders.serializers import OrderSerializer
# from datetime import timedelta

# class DashboardViewSet(viewsets.ViewSet):
#     permission_classes = [IsAuthenticated]  # Ensure user is authenticated


#     @action(detail=False, methods=['get'], url_path='sales-trends')
#     def sales_trends(self, request):
#         """Fetch sales trends (line chart data)"""
#         today = now().date()
#         start_date = today - timedelta(days=30)

#         # Generate list of all dates from start_date to today
#         all_dates = [start_date + timedelta(days=i) for i in range(31)]

#         # Get the total sales for each day
#         sales_data = Order.objects.filter(ordered_at__gte=start_date) \
#             .values('ordered_at__date') \
#             .annotate(total_sales=Sum('total_price')) \
#             .order_by('ordered_at__date')

#         # Create a dictionary for quick lookup of sales data by date
#         sales_dict = {str(data['ordered_at__date']): data['total_sales'] for data in sales_data}

#         # Prepare data for chart
#         chart_data = []
#         for date in all_dates:
#             date_str = date.strftime('%Y-%m-%d')
#             chart_data.append({
#                 'date': date_str,
#                 'revenue': sales_dict.get(date_str, 0)  # Default to 0 if no sales for that date
#             })

#         return Response(chart_data)

#     @action(detail=False, methods=['get'], url_path='top-products')
#     def top_products(self, request):
#         """Fetch top ordered products"""
#         top_products = Product.objects.annotate(order_count=Count('orderitem')) \
#             .order_by('-order_count')[:10]

#         top_product_data = []
#         for product in top_products:
#             order_items = OrderItem.objects.filter(product=product)
            
#             total_revenue = order_items.aggregate(
#                 total_revenue=Sum('price') * Sum('quantity')
#             )['total_revenue'] or 0
            
#             total_units_sold = order_items.aggregate(
#                 total_units_sold=Sum('quantity')
#             )['total_units_sold'] or 0

#             top_product_data.append({
#                 'id': product.id,
#                 'name': product.name,
#                 'revenue': total_revenue,
#                 'units_sold': total_units_sold,
#             })
        
#         return Response(top_product_data)

#     @action(detail=False, methods=['get'], url_path='marketing-effectiveness')
#     def marketing_effectiveness(self, request):
#         """Fetch today's visitor count (or any marketing metric)"""
#         today = now().date()
#         visitor_count = 1000  # Replace with actual logic to track visitors
#         return Response({'visitor_count': visitor_count})

#     @action(detail=False, methods=['get'], url_path='recent-orders')
#     def recent_orders(self, request):
#         """Fetch the most recent orders"""
#         recent_orders = Order.objects.all().order_by('-ordered_at')[:10]
#         serializer = OrderSerializer(recent_orders, many=True)
#         return Response(serializer.data)


from django.db.models import Count, Sum, F, DecimalField
from django.utils.timezone import now
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from products.models import Product
from orders.models import Order, OrderItem
from orders.serializers import OrderSerializer

from datetime import timedelta

class DashboardViewSet(viewsets.ViewSet):
    """
    A ViewSet for all dashboard data:
    - Sales Trends (line chart)
    - Top Products
    - Order Status Distribution (pie chart)
    - Recent Orders
    """
    permission_classes = [IsAuthenticated]  # Only authenticated users
    
    @action(detail=False, methods=['get'], url_path='sales-trends')
    def sales_trends(self, request):
        """Fetch sales trends (line chart data) for the last 30 days."""
        today = now().date()
        start_date = today - timedelta(days=30)

        # Generate list of dates from start_date to today
        all_dates = [start_date + timedelta(days=i) for i in range(31)]

        # Sum of total_price by each date
        sales_data = (
            Order.objects.filter(ordered_at__date__gte=start_date)
            .values('ordered_at__date')
            .annotate(total_sales=Sum('total_price'))
            .order_by('ordered_at__date')
        )

        # Convert DB results into a dict { 'YYYY-MM-DD': total_sales }
        sales_dict = {
            str(item['ordered_at__date']): item['total_sales'] 
            for item in sales_data
        }

        # Prepare final chart data
        chart_data = []
        for date in all_dates:
            date_str = date.strftime('%Y-%m-%d')
            chart_data.append({
                'date': date_str,
                'revenue': sales_dict.get(date_str, 0)  # Default to 0 if no sales
            })

        return Response(chart_data)

    @action(detail=False, methods=['get'], url_path='top-products')
    def top_products(self, request):
        """Fetch top ordered products (by units sold)."""
        # We compute totals via OrderItem to get correct revenue: sum of (price * quantity).
        # This approach aggregates across all order items referencing each product.
        top_products_data = (
            OrderItem.objects
            .values('product__id', 'product__name')
            .annotate(
                total_revenue=Sum(F('price') * F('quantity'), output_field=DecimalField()),
                units_sold=Sum('quantity')
            )
            .order_by('-units_sold')[:5]
        )

        # Transform results to match the old structure
        results = []
        for item in top_products_data:
            results.append({
                'id': item['product__id'],
                'name': item['product__name'],
                'revenue': item['total_revenue'] or 0,
                'units_sold': item['units_sold'] or 0,
            })

        return Response(results)

    @action(detail=False, methods=['get'], url_path='order-status-distribution')
    def order_status_distribution(self, request):
        """
        Returns how many orders exist in each status:
        [
          { "status": "Pending", "count": 10 },
          { "status": "Delivered", "count": 25 },
          ...
        ]
        """
        data = (
            Order.objects
            .values('status')
            .annotate(count=Count('id'))
            .order_by('status')
        )
        return Response(data)

    @action(detail=False, methods=['get'], url_path='recent-orders')
    def recent_orders(self, request):
        """Fetch the 10 most recent orders, newest first."""
        recent_orders = Order.objects.all().order_by('-ordered_at')[:5]
        serializer = OrderSerializer(recent_orders, many=True)
        return Response(serializer.data)
