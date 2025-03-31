from django.shortcuts import render
from django.http import JsonResponse
from .models import Customer


def get_customers(response):
    customers = list(Customer.objects.values())
    return JsonResponse(customers, safe=False)


