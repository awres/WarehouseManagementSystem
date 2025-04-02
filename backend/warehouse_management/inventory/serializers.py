from rest_framework import serializers
from .models import Product, Customer, Order, Return, OrderItem

class ProductSerializer(serializers.ModelSerializer):
    # Remove read_only=True to allow updating these fields
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

class CustomerUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['first_name', 'last_name', 'email', 'phone', 'address', 'updated_at']
        read_only_fields = ['updated_at']  # Prevents manual modification of updated_at

class OrdersSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer()

    class Meta:
        model = Order
        fields = ['id', 'customer', 'order_date', 'status', 'total']

        
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

class OrderUpdateSerializer(serializers.ModelSerializer):
    customer_first_name = serializers.CharField(write_only=True)
    customer_last_name = serializers.CharField(write_only=True)
    
    class Meta:
        model = Order
        fields = ['status', 'total', 'customer_first_name', 'customer_last_name']