from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)                # Nazwa produktu
    sku = models.CharField(max_length=100, unique=True)     # SKU (unikalny kod)
    barcode = models.CharField(max_length=100, unique=True, null=True, blank=True)  # Kod kreskowy
    category = models.CharField(max_length=100, null=True, blank=True)  # Kategoria produktu
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Cena produktu
    stock_quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Ilość w magazynie
    
    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('SHIPPED', 'Shipped'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    customer = models.ForeignKey('Customer', on_delete=models.CASCADE)  # Klient, który złożył zamówienie
    order_date = models.DateTimeField(auto_now_add=True)  # Data zamówienia
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')  # Status zamówienia
    total = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Całkowita wartość zamówienia
    
    
    def __str__(self):
        return f"Order {self.id} by {self.customer}"

class OrderItem(models.Model):
    order = models.ForeignKey('Order', on_delete=models.CASCADE)  # Identyfikator zamówienia
    product = models.ForeignKey('Product', on_delete=models.CASCADE)  # Identyfikator produktu
    quantity = models.DecimalField(max_digits=10, decimal_places=2)  # Ilość zamówionego produktu
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Cena jednostkowa produktu
    
    def __str__(self):
        return f"Item {self.product.name} in order {self.order.id}"

class Return(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    order_item = models.ForeignKey('OrderItem', on_delete=models.CASCADE)  # Pozycja zamówienia, która jest zwracana
    return_date = models.DateTimeField(auto_now_add=True)  # Data zwrotu
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')  # Status zwrotu
    notes = models.TextField(null=True, blank=True)  # Dodatkowe informacje o zwrocie
    
    def __str__(self):
        return f"Return for {self.order_item.product.name}"

class Customer(models.Model):
    first_name = models.CharField(max_length=255)  # Imię klienta
    last_name = models.CharField(max_length=255)   # Nazwisko klienta
    email = models.EmailField(unique=True)         # E-mail klienta (unikalny)
    phone = models.CharField(max_length=20, null=True, blank=True)  # Numer telefonu klienta
    address = models.CharField(max_length=255, null=True, blank=True)  # Adres klienta
    created_at = models.DateTimeField(auto_now_add=True)  # Data utworzenia konta
    updated_at = models.DateTimeField(auto_now=True)    # Data ostatniej aktualizacji
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class User(models.Model):
    username = models.CharField(max_length=255, unique=True)  # Nazwa użytkownika
    password_hash = models.CharField(max_length=255)           # Zaszyfrowane hasło
    role = models.ForeignKey('Role', on_delete=models.SET_NULL, null=True)  # Rola użytkownika
    
    def __str__(self):
        return self.username

class Role(models.Model):
    role_name = models.CharField(max_length=100)  # Nazwa roli (np. Administrator, Magazynier, Kierownik)
    
    def __str__(self):
        return self.role_name
