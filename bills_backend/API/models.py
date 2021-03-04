from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from jsonfield import JSONField

# Create your models here.

class UserInfo(models.Model):
    user = models.ForeignKey(User, related_name="user", on_delete=models.CASCADE)
    no = models.CharField(max_length=100, default=None, null=True)
    avatar = models.CharField(max_length=255, default=None, null=True, blank=True)
    email = models.EmailField(max_length=255, default=None, null=True, blank=True)
    password = models.CharField(max_length=50, default=None, null=True, blank=True)
    subject = models.CharField(max_length=500, default="Bill", null=True, blank=True)
    body = models.CharField(max_length=1000, default="Please find your bill attached to this mail.", null=True, blank=True)
    smtp_host = models.CharField(max_length=50, default='smtp.gmail.com', null=True, blank=True)
    smtp_port = models.CharField(max_length=10, default='587', null=True, blank=True)

class Item(models.Model):
    user = models.ForeignKey(User, related_name="user_item", on_delete=models.CASCADE)
    no = models.CharField(max_length=100, default=None, null=True)
    name = models.CharField(max_length=255, default=None, null=True)
    date = models.DateTimeField(default=None, null=True)
    rate = models.DecimalField(max_digits=13, decimal_places=2, default=None, null=True)

class Bill(models.Model):
    user = models.ForeignKey(User, related_name="user_bill", on_delete=models.CASCADE)
    no = models.CharField(max_length=100, default=None, null=True)
    date = models.DateTimeField(default=None, null=True)
    customer_name = models.CharField(max_length=255, default=None, null=True)
    customer_email = models.EmailField(max_length=255, default=None, null=True, blank=True)
    remarks = models.JSONField();
    documents = ArrayField(models.JSONField(), default=list, blank=True)
    items_id = ArrayField(models.CharField(max_length=20), default=list, blank=True)
    items = ArrayField(models.JSONField(), default=list, blank=True)
    amount = models.DecimalField(max_digits=100, decimal_places=2, default=None)
    quantity = models.DecimalField(max_digits=12, decimal_places=3, default=None)

class Customer(models.Model):
    user = models.ForeignKey(User, related_name="user_customer", on_delete=models.CASCADE)
    no = models.CharField(max_length=100, default=None, null=True)
    name = models.CharField(max_length=255, default=None, null=True)
    date = models.DateTimeField(default=None, null=True)
    avatar = models.CharField(max_length=255, default=None, null=True, blank=True)
    email = models.EmailField(max_length=255, default=None, blank=True, null=True)
    phone = models.CharField(max_length=20, default=None, blank=True, null=True)