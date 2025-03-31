from django.contrib import admin
from .models import Customer, Product, Role, Order, OrderItem, Return, User

admin.site.register(Customer)
admin.site.register(Product)
admin.site.register(Role)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Return)
admin.site.register(User)
