from django.contrib import admin
from .models import *

# Register your models here.

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'no', 'name', 'rate')

@admin.register(UserInfo)
class UserInfoAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'no', 'email')

@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'no', 'date', 'customer_name', 'quantity', 'amount')

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'no', 'name', 'email')