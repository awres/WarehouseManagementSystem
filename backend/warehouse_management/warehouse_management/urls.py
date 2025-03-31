"""
URL configuration for warehouse_management project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from inventory.views import get_customers, get_products, get_roles, get_orders, get_orderItems, get_returns,get_customers, get_users, get_orders_by_customer


urlpatterns = [
    path('admin/', admin.site.urls),
    path('customers/',get_customers,  name='get_customers'),
    path('products/',get_products,  name='get_products'),
    path('roles/',get_roles,  name='get_roles'),
    path('orders/',get_orders,  name='get_orders'),
    path('orderitems/',get_orderItems,  name='get_orderItems'),
    path('returns/',get_returns,  name='get_returns'),
    path('users/',get_users,  name='get_users'),
    
    path('orders/customers/<int:customer_id>/', get_orders_by_customer, name='get_orders_by_customer')

]


