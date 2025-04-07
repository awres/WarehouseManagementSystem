from django.shortcuts import render
from django.http import JsonResponse
from .models import Customer
from .models import Product
from .models import Role
from .models import Order
from .models import OrderItem
from .models import Return
from .models import User
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProductSerializer, CustomerSerializer, OrdersSerializer, ReturnSerializer, OrderItemSerializer, RoleSerializer



@api_view(['GET'])
def get_returns(request):
     returns = Return.objects.all()
     Serializer = ReturnSerializer(returns, many=True)
     return Response(Serializer.data)
 
@api_view(['GET'])
def get_OrderItems(request):
     orderItems = OrderItem.objects.all()
     Serializer = OrderItemSerializer(orderItems, many=True)
     return Response(Serializer.data)

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


@api_view(['GET'])
def get_orders(request):
    orders = Order.objects.all()
    serializer = OrdersSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def post_product(request):
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

@api_view(['PUT'])
def update_customer(request, id):
    try:
        customer = Customer.objects.get(pk=id)
    except Customer.DoesNotExist:
        return Response({"error": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = CustomerSerializer(customer, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save(updated_at=timezone.now())  # ✅ Ensure updated_at is set
        return Response(serializer.data)

    print(serializer.errors)  # ✅ Print validation errors in the console
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_product(request, id):
    try:
        product = Product.objects.get(pk=id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ProductSerializer(product, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_product(request, id):
    try:
        product = Product.objects.get(pk=id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
    
    product.delete()
    return Response({"message": "Product deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


@api_view(['PUT'])
def update_order(request, id):
    try:
        order = Order.objects.get(pk=id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Extract customer data
    customer_first_name = request.data.get('customer_first_name')
    customer_last_name = request.data.get('customer_last_name')
    
    # Update customer information if provided
    if customer_first_name and customer_last_name:
        customer = order.customer
        customer.first_name = customer_first_name
        customer.last_name = customer_last_name
        customer.save()
    
    # Update order status and ensure it's uppercase
    if 'status' in request.data:
        order.status = request.data.get('status').upper()
    
    # Convert total to decimal if provided
    if 'total' in request.data:
        try:
            order.total = float(request.data.get('total'))
        except (ValueError, TypeError):
            return Response({"error": "Invalid total value"}, status=status.HTTP_400_BAD_REQUEST)
    
    order.save()
    
    # Return the updated order
    serializer = OrdersSerializer(order)
    return Response(serializer.data)




@api_view(['DELETE'])
def delete_order(request, id):
    try:
        order = Order.objects.get(pk=id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
    
    order.delete()
    return Response({"message": "Order deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def add_order(request):
    if request.method == 'POST':
        # Extract customer data
        customer_data = request.data.get('customer', {})
        
        try:
            # Try to find existing customer
            customer = Customer.objects.get(
                first_name=customer_data.get('first_name'),
                last_name=customer_data.get('last_name')
            )
        except Customer.DoesNotExist:
            # Create new customer if not found
            customer_serializer = CustomerSerializer(data=customer_data)
            if customer_serializer.is_valid():
                customer = customer_serializer.save()
            else:
                return Response(customer_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Get status and ensure it's uppercase
        status_value = request.data.get('status', 'PENDING').upper()
        
        # Create order data
        order_data = {
            'customer': customer.id,
            'status': status_value,
            'total': request.data.get('total', 0),
            'order_date': timezone.now()
        }
        
        # Create the order
        serializer = OrdersSerializer(data=order_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def create_role(request):
    if request.method == 'POST':
        serializer = RoleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Zapisanie roli w bazie
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def get_roles(request):
    roles = Role.objects.all()  # Pobierz wszystkie role
    serializer = RoleSerializer(roles, many=True)  # Serializuj dane
    return Response(serializer.data)  # Zwróć dane w odpowiedzi


@api_view(['PUT'])
def update_role(request, id):
    try:
        role = Role.objects.get(pk=id)
    except Role.DoesNotExist:
        return Response({"error": "Role not found"}, status=status.HTTP_404_NOT_FOUND)

    # Serializuj dane i zaktualizuj rolę
    serializer = RoleSerializer(role, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_role(request, id):
    try:
        role = Role.objects.get(pk=id)
    except Role.DoesNotExist:
        return Response({"error": "Role not found"}, status=status.HTTP_404_NOT_FOUND)

    role.delete()
    return Response({"message": "Role deleted successfully"}, status=status.HTTP_204_NO_CONTENT)