import random
from rest_framework import viewsets, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.http import urlsafe_base64_decode
from .models import CustomUser
from .serializers import UserSerializer, RegisterSerializer, PasswordResetRequestSerializer, SetNewPasswordSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from rest_framework_simplejwt.views import TokenObtainPairView
from .utils import verify_recaptcha, verify_google_token
from django.core.files.base import ContentFile
import requests
from django.core.files.uploadedfile import SimpleUploadedFile
import uuid
 
FIRST_NAMES = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"]
LAST_NAMES = ["Smith", "Johnson", "Brown", "Taylor", "Anderson", "Lee"]
DOMAINS = ["example.com", "test.com", "mail.com"]


def generate_random_users(n=5):
    created_users = []

    for _ in range(n):
        while True:
            username = f"user{random.randint(1000, 9999)}"
            if not CustomUser.objects.filter(username=username).exists():
                break

        first_name = random.choice(FIRST_NAMES)
        last_name = random.choice(LAST_NAMES)
        email = f"{first_name.lower()}.{last_name.lower()}@{random.choice(DOMAINS)}"

        user = CustomUser.objects.create(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email
        )
        created_users.append(user)

    return created_users


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    parser_classes = [parsers.JSONParser, parsers.MultiPartParser, parsers.FormParser]

    @action(detail=False, methods=["post"])
    def generate(self, request):
        users = generate_random_users(5)
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], url_path='register', serializer_class=RegisterSerializer)
    def register(self, request):

        recaptcha_token = request.data.get("recaptcha_token")
        if not recaptcha_token:
            return Response({"detail": "Missing reCAPTCHA token"}, status=400)

        result = verify_recaptcha(recaptcha_token)
        if not result.get("success") or result.get("score", 0) < 0.5:
            return Response({"detail": "Invalid reCAPTCHA"}, status=400)


        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='password-reset-request',serializer_class=PasswordResetRequestSerializer)
    def password_reset_request(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Лист для відновлення паролю відправлено"}, 
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'], url_path='password-reset-confirm', serializer_class=SetNewPasswordSerializer)
    def password_reset_confirm(self, request):
        serializer = SetNewPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            uid = urlsafe_base64_decode(serializer.validated_data['uid']).decode()
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            return Response({"detail": "Невірний uid"}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, serializer.validated_data['token']):
            return Response({"detail": "Невірний або прострочений токен"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({"detail": "Пароль успішно змінено"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], url_path="googleregister")
    def google_register(self, request):
        token = request.data.get("token")

        if not token:
            return Response({"detail": "Missing Google token"}, status=400)

        user_info = verify_google_token(token)

        if not user_info:
            return Response({"detail": "Invalid Google token"}, status=400)

        email = user_info.get("email")
        username = email.split("@")[0]
        first_name = user_info.get("given_name", "")
        last_name = user_info.get("family_name", "")
        picture_url = user_info.get("picture")

        user = CustomUser.objects.filter(email=email).first()
        if user:
            return Response({"detail": "User already exists"}, status=400)

        image_file = None
        if picture_url:
            try:
                response = requests.get(picture_url)
                if response.status_code == 200:
                    file_name = f"{uuid.uuid4()}.jpg"
                    image_file = SimpleUploadedFile(
                        name=file_name,
                        content=response.content,
                        content_type="image/jpeg"
                    )
            except Exception as e:
                print("Image fetch failed:", e)

        user = CustomUser.objects.create_user(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
        )

        if image_file:
            user.image_small = image_file
            user.save()

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=["post"], url_path="googleLogin2")
    def google_login(self, request):
        token = request.data.get("token")

        if not token:
            return Response({"detail": "Missing Google token"}, status=400)

        user_info = verify_google_token(token)

        if not user_info:
            return Response({"detail": "Invalid Google token"}, status=400)

        email = user_info.get("email")

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not registered"}, status=400)

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_200_OK
        )

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        recaptcha_token = request.data.get("recaptcha_token")
        if not recaptcha_token:
            return Response({"detail": "Missing reCAPTCHA token"}, status=400)

        result = verify_recaptcha(recaptcha_token)
        if not result.get("success") or result.get("score", 0) < 0.5:
            return Response({"detail": "Invalid reCAPTCHA"}, status=400)

        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({"detail": "Invalid credentials"}, status=401)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
