from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum
from datetime import timedelta
from django.utils import timezone
from .models import Transaction, Budget
from .serializers import TransactionSerializer, BudgetSerializer, UserRegisterSerializer
import subprocess, random


class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]

class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Transaction.objects.filter(user=user)
        
        month = self.request.query_params.get('month')
        if month:
            qs = qs.filter(date__startswith=month)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BudgetListCreateView(generics.ListCreateAPIView):
    serializer_class = BudgetSerializer

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AIAdviceView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        today = timezone.now().date()
        since = today - timedelta(days=30)
        tx = Transaction.objects.filter(user=user, date__gte=since)
        agg = (
            tx.filter(type='Expense')
              .values('category')
              .annotate(total=Sum('amount'))
              .order_by('-total')[:10]
        )

        if not agg:
            return Response({
                "advice": "No expense data in the last 30 days. "
                          "Add a few transactions to get personalized advice."
            })
           
        summary_lines = [f"{a['category']}: ₹{float(a['total']):.2f}" for a in agg]
        summary = "\n".join(summary_lines)

        prompt = (
            f"User's last 30 days spending:\n{summary}\n\n"
            "Give 3 short, friendly, practical finance tips. "
            "Each suggestion in one sentence."
        )

        advice = None
        try:
            result = subprocess.run(
                ["ollama", "run", "mistral", prompt],
                capture_output=True,
                text=True,
                timeout=25
            )
            if result.returncode == 0:
                advice = result.stdout.strip()
        except FileNotFoundError:
            
            print("⚠️ Ollama not found — using fallback rule-based advice.")
        except subprocess.TimeoutExpired:
            print("⚠️ Ollama response timeout — using fallback.")

        
        if not advice or advice == "":
            print("💡 Using fallback advice instead of AI output.")
            advice = self.generate_rule_based_advice(agg)

        return Response({"advice": advice})

    def generate_rule_based_advice(self, agg):
        """
        Simple rule-based tips using the expense breakdown.
        """
        
        top_cat = agg[0]['category'] if agg else "General"
        total_expense = sum(float(a['total']) for a in agg)
        tips = [
            f"Your biggest spending is on {top_cat}. Try setting a weekly limit for it.",
            f"Save at least 10% of your income each month — automate it to avoid skipping.",
            f"Review small recurring expenses; even ₹500 subscriptions add up fast.",
            f"Cook at home twice a week instead of dining out to save around ₹2,000 monthly.",
            f"Consider using an expense tracker to get better visibility of your spending.",
        ]
        random.shuffle(tips)
        selected = tips[:3]
        return "\n".join(selected)
