from django.shortcuts import render
from django.http import JsonResponse
from django.utils.dateparse import parse_datetime
import datetime
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
    
@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


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
        orders = Order.objects.filter(customer_id=customer_id).select_related('customer').values(
            'id', 'order_date', 'status', 'total', 
            'customer__first_name', 'customer__last_name'
        )

        orders_list = []
        for order in orders:
            formatted_date = "Nieprawidłowa data"
            if isinstance(order['order_date'], datetime.datetime):
                formatted_date = order['order_date'].strftime("%Y/%m/%d %H:%M")
            else:
                parsed_date = parse_datetime(order['order_date'])
                if parsed_date:
                    formatted_date = parsed_date.strftime("%Y/%m/%d %H:%M")

            order_data = {
                'id': order['id'],
                'customer_name': f"{order['customer__first_name']} {order['customer__last_name']}",
                'order_date': formatted_date,
                'status': order['status'],
                'total': order['total']
            }
            orders_list.append(order_data)

        return JsonResponse(orders_list, safe=False)

    except Customer.DoesNotExist:
        return JsonResponse({"error": "Customer not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)