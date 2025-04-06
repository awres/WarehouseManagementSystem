from django.contrib import admin
from django.urls import path
from inventory.views import (
    get_products, get_customers, post_product, get_orders, update_order, delete_order,
    update_product, delete_product, add_order, update_customer, get_returns, get_OrderItems, create_role
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('get/customers/', get_customers, name='get_customers'),
    path('get/products/', get_products, name='get_products'),
    path('post/products/', post_product, name='post_product'),
    path('get/orders/', get_orders, name='get_orders'),
    path('update/products/<int:id>/', update_product, name='update_product'),
    path('delete/products/<int:id>/', delete_product, name='delete_product'),
    path('update/customers/<int:id>/', update_customer, name='update_customer'), 
    path('get/returns/', get_returns, name='get_returns'),
    path('get/orderitems/', get_OrderItems, name='get_returns'),
path('update/orders/<int:id>/', update_order, name='update_order'),
path('delete/orders/<int:id>/', delete_order, name='delete_order'),
path('api/roles/', create_role, name='create_role'),
]
