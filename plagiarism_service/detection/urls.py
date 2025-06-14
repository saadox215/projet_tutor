from django.urls import path
from .views import detect_plagiarism

urlpatterns = [
    path('plagiat/', detect_plagiarism),
]
