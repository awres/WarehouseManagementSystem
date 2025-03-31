from django.shortcuts import render
from django.http import JsonResponse
from .models import Customer
from .models import Product
from .models import Role
from .models import Order
from .models import OrderItem
from .models import Return
from .models import User


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