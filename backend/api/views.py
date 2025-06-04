from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services import WeatherService
from django.http import JsonResponse
import requests
import logging

logger = logging.getLogger(__name__)

# Create your views here.

class WeatherView(APIView):
    def get(self, request):
        try:
            # Get city from query parameters
            city = request.GET.get('city')
            if not city:
                return JsonResponse({'error': 'City parameter is required'}, status=400)
            
            print(f"\n=== Weather View Request ===")
            print(f"City: {city}")
            
            # Initialize weather service
            weather_service = WeatherService()
            
            # Get weather data
            logger.info(f"Fetching weather for city: {city}")
            data = weather_service.get_weather(city)
            
            print(f"\n=== Weather View Response ===")
            print(f"Data: {data}")
            
            # Check if there was an error
            if 'error' in data:
                logger.error(f"Weather service error: {data['error']}")
                print(f"\n=== Weather View Error ===")
                print(f"Error: {data['error']}")
                return JsonResponse(data, status=400)
            
            # Print temperature details if available
            if 'main' in data:
                print(f"\n=== Temperature Details ===")
                print(f"Current Temperature: {data['main']['temp']}°C / {data['main']['temp_f']}°F")
                print(f"Feels Like: {data['main']['feels_like']}°C / {data['main']['feels_like_f']}°F")
                print(f"Min Temperature: {data['main']['temp_min']}°C / {data['main']['temp_min_f']}°F")
                print(f"Max Temperature: {data['main']['temp_max']}°C / {data['main']['temp_max_f']}°F")
            
            return JsonResponse(data)
            
        except Exception as e:
            logger.exception("Unexpected error in weather view")
            print(f"\n=== Weather View Exception ===")
            print(f"Error: {str(e)}")
            return JsonResponse({'error': 'Internal server error'}, status=500)