# forms.py
from django import forms
from .models import Product, ProductImage


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ["category", "name", "description", "price"]
        widgets = {
            "name": forms.TextInput(attrs={"class": "form-control"}),
            "description": forms.Textarea(attrs={"class": "form-control", "rows": 3}),
            "price": forms.NumberInput(attrs={"class": "form-control", "min": 0}),
            "category": forms.Select(attrs={"class": "form-select"}),
        }


class ProductImageForm(forms.ModelForm):
    class Meta:
        model = ProductImage
        fields = ["image", "priority"]
        widgets = {
            "image": forms.ClearableFileInput(attrs={"class": "form-control"}),
            "priority": forms.NumberInput(attrs={"class": "form-control", "min": 0}),
        }

