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
from .serializers import ProductSerializer

def get_customers(response):
    customers = list(Customer.objects.values())
    return JsonResponse(customers, safe=False)
    
def get_products(response):
    products = list(Product.objects.values())
    return JsonResponse(products, safe=False)

def get_roles(response):
    roles = list(Role.objects.values())
    return JsonResponse(roles, safe=False)

def get_orders(response):
    orders = list(Order.objects.values())
    return JsonResponse(orders, safe=False)

def get_orderItems(response):
    orderitems = list(OrderItem.objects.values())
    return JsonResponse(orderitems, safe=False)

def get_returns(response):
    returns = list(Return.objects.values())
    return JsonResponse(returns, safe=False)

def get_users(response):
    users = list(User.objects.values())
    return JsonResponse(users, safe=False)


@api_view(['POST'])
def add_product(request):
    if request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def get_orders_by_customer(request, customer_id):
    try:
        # Pobieramy klienta na podstawie customer_id
        customer = Customer.objects.get(id=customer_id)

        # Pobieramy zamówienia tego klienta
        orders = Order.objects.filter(customer=customer).values(
            'id', 'order_date', 'status', 'total', 
            'customer__first_name', 'customer__last_name'
        )

        # Przekształcamy dane, aby first_name i last_name były na początku
        orders_list = []
        for order in orders:
            order_data = {
                'id': order['id'],
                'first_name': order['customer__first_name'],
                'last_name': order['customer__last_name'],
                'order_date': order['order_date'],
                'status': order['status'],
                'total': order['total']
            }
            orders_list.append(order_data)

        return JsonResponse(orders_list, safe=False)

    except Customer.DoesNotExist:
        return JsonResponse({"error": "Customer not found"}, status=404)