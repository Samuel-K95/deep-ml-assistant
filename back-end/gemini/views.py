from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import gemini_request

# Create your views here.

class AnalyzeeProblemView(APIView):
    def post(self, request):
        title = request.data.get('title')
        problem = request.data.get('problem')
        examples = request.data.get('example')
        try:
            response = gemini_request.analyzeRequest({title: title, problem: problem, examples: examples})
            return Response(response, status=status.HTTP_200_OK)
        except:
            return Response({"error": "error while fetching from AI"}, status.HTTP_500_INTERNAL_SERVER_ERROR)



class DebugCodeView(APIView):
    def post(self, request):
        problem = request.data.get('problem')
        example = request.data.get('example')
        code = request.data.get('code')
        errors = request.data.get('errors')
        response = gemini_request.debugRequest({"problem": problem, "errors": errors, "code": code, "example": example})
        return Response(response, status=status.HTTP_200_OK)
        


