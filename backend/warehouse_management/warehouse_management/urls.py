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
from inventory.views import get_products,get_customers, post_product, get_orders


urlpatterns = [
    path('admin/', admin.site.urls),
    path('get/customers/', get_customers, name='get_customers'),
    path('get/products/',get_products,  name='get_products'),
    path('post/products/', post_product, name='post_product'),
    path('get/orders/', get_orders, name='get_orders'),
]


