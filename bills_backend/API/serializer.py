from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

class UserInfoSerializer(serializers.ModelSerializer):
    queryset = User.objects.all()
    user = serializers.PrimaryKeyRelatedField(queryset=queryset,many=False,read_only=False)
    class Meta:
        model = UserInfo
        fields = ['id', 'no', 'user', 'avatar', 'email', 'subject', 'body']

class ItemSerializer(serializers.ModelSerializer):
    queryset = User.objects.all()
    user = serializers.PrimaryKeyRelatedField(queryset=queryset,many=False,read_only=False)
    class Meta:
        model = Item
        fields = "__all__"

class BillSerializer(serializers.ModelSerializer):
    queryset = User.objects.all()
    user = serializers.PrimaryKeyRelatedField(queryset=queryset,many=False,read_only=False)
    class Meta:
        model = Bill
        fields = "__all__"

class CustomerSerializer(serializers.ModelSerializer):
    queryset = User.objects.all()
    user = serializers.PrimaryKeyRelatedField(queryset=queryset,many=False,read_only=False)
    class Meta:
        model = Customer
        fields = "__all__"

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ('key', 'user')
