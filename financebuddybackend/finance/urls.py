from django.urls import path
from .views import RegisterView, TransactionListCreateView, BudgetListCreateView, AIAdviceView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('transactions/', TransactionListCreateView.as_view(), name='transactions'),
    path('budget/', BudgetListCreateView.as_view(), name='budget'),
    path('ai/advice/', AIAdviceView.as_view(), name='ai-advice'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
