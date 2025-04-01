from rest_framework import serializers
from .models import Product, Customer

class ProductSerializer(serializers.ModelSerializer):
    sku = serializers.CharField(read_only=True)
    barcode = serializers.CharField(read_only=True)
    stock_quantity = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = Product
        fields = ['name', 'sku', 'category', 'price', 'stock_quantity', 'barcode']

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'address', 'created_at', 'updated_at']