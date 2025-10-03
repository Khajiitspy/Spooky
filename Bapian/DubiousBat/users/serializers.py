from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'image_small', 'image_medium', 'image_large']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    image = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'image')

    def create(self, validated_data):
        image = validated_data.pop('image', None)
        user = CustomUser.objects.create_user(**validated_data)
        if image:
            user.image_medium = image  # optional: auto resize to small/large
            user.save()
        return user
