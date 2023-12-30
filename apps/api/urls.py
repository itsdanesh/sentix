from django.urls import path
from . import views

urlpatterns = [
    path("status", views.get_model_status, name="get_model_status"),
    path("train", views.train, name="train_model"),
    path("calc", views.get_sentiment, name="get_sentiment"),
    path("data", views.manipulate_data, name="manipulate_data"),
    path('accuracy', views.get_accuracy_score, name='get_accuracy_score'),
<<<<<<< HEAD
      path("explain", views.explain_text, name="explain_text"),
=======
>>>>>>> a764c28c979b814c4b7352d340e6b542dcb709c4
    
]
