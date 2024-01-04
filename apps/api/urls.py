from django.urls import path
from . import views

urlpatterns = [
    path('report', views.handle_user_reports, name='report'),
    path('status', views.get_model_status, name='status'),
    path('train', views.train, name='train'),
    path('revert', views.switch_models, name='revert'),
    path('calc', views.get_sentiment, name='calc'),
    path('data', views.manipulate_data, name='data'),
    path('accuracy', views.get_accuracy_score, name='accuracy'),
    path("explain", views.explain_text, name="explain_text"),
]
