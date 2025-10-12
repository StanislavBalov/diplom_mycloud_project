from rest_framework import serializers
from .models import User
import re

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ('username', 'full_name', 'email', 'password')

    def validate_username(self, value):
        if not re.match(r'^[A-Za-z][A-Za-z0-9]{3,19}$', value):
            raise serializers.ValidationError('Username must be 4-20 chars, start with a letter, letters and digits only')
        return value

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError('Password too short')
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError('Password must contain an uppercase letter')
        if not re.search(r'\d', value):
            raise serializers.ValidationError('Password must contain a digit')
        if not re.search(r'[^A-Za-z0-9]', value):
            raise serializers.ValidationError('Password must contain a special character')
        return value

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            full_name=validated_data.get('full_name', ''),
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'full_name', 'email', 'is_administrator', 'storage_path')
