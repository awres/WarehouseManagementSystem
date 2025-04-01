from django.shortcuts import render
from django.http import JsonResponse
from .models import Customer
from .models import Product
from .models import Role
from .models import Order
from .models import OrderItem
from .models import Return
from .models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProductSerializer, CustomerSerializer

@api_view(['GET'])
def get_customers(request):
    customers = Customer.objects.all()
    serializer = CustomerSerializer(customers, many=True)
    return Response(serializer.data)
    
@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

def get_orders(response):
    orders = list(Order.objects.values())
    return JsonResponse(orders, safe=False)


@api_view(['POST'])
def add_product(request):
    if request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def add_order(request):
    if request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


