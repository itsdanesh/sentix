from django.urls import path
from .views import get_model_status, train, get_sentiment
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path("status", get_model_status, name="get_model_status"),
    path("train", train, name="train_model"),
    path("calc", get_sentiment, name="get_sentiment"),
]
