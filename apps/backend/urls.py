from django.urls import path
from .views import get_sentiment

urlpatterns = [
    path(
        "calc/",
        get_sentiment,
        name="get_sentiment",
    )
]
