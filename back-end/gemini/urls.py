from django.urls import path, include
from .views import AnalyzeeProblemView, DebugCodeView

urlpatterns = [
    path('analyze/', view=AnalyzeeProblemView.as_view(), name='analze-problem-view'),
    path('debug/', view=DebugCodeView.as_view(), name='debug-code-view')
]