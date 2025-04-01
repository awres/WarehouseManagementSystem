from rest_framework import serializers
from .models import Product, Customer, Return, OrderItem

class ProductSerializer(serializers.ModelSerializer):
    sku = serializers.CharField(required=False, allow_blank=True)
    barcode = serializers.CharField(required=False, allow_blank=True)
    stock_quantity = serializers.DecimalField(max_digits=10, decimal_places=2)
    id = serializers.IntegerField(read_only=True)  

    class Meta:
        model = Product
        fields = ['id', 'name', 'sku', 'category', 'price', 'stock_quantity', 'barcode']

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'address', 'created_at', 'updated_at']

class ReturnSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)  
    class Meta:
        model = Return
        fields = ['id', 'status', 'order_item', 'return_date', 'notes']

class OrderItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'quantity', 'price']