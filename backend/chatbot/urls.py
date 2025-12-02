from django.urls import path
from .views import ChatbotAPI, AreasAPI

urlpatterns = [
    path('query/', ChatbotAPI.as_view(), name='chatbot-query'),
    path('areas/', AreasAPI.as_view(), name='areas-list'),
]