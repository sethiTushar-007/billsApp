from django.contrib import admin
from .models import *
from django.contrib.sites.model import SiteAdmin
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

admin.site.unregister(Site)
class SiteAdmin(admin.ModelAdmin):
    fields = ('id', 'name', 'domain')
    readonly_fields = ('id',)
    list_display = ('id', 'name', 'domain')
    list_display_links = ('name',)
    search_fields = ('name', 'domain')
admin.site.register(Site, SiteAdmin)