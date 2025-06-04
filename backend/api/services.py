import os
import requests
from django.conf import settings
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)

class WeatherService:
    def __init__(self):
        load_dotenv()  # Make sure we load the .env file
        self.api_key = os.getenv('OPENWEATHER_API_KEY')
        logger.info(f"API key loaded: {'Yes' if self.api_key else 'No'}")
        
        if not self.api_key:
            raise ValueError("API key not found in environment variables. Please check your .env file.")
            
        self.base_url = 'https://api.openweathermap.org/data/2.5'
        self.geocode_url = 'https://api.openweathermap.org/geo/1.0/direct'

    def get_clothing_suggestions(self, temp_f):
        """Get clothing suggestions based on temperature in Fahrenheit."""
        suggestions = {
            'top': [],
            'bottom': [],
            'outerwear': [],
            'accessories': []
        }
        
        if temp_f < 32:
            suggestions['top'].extend(['Thermal base layer', 'Long-sleeve shirt', 'Sweater'])
            suggestions['bottom'].extend(['Thermal leggings', 'Warm pants'])
            suggestions['outerwear'].extend(['Heavy winter coat', 'Insulated jacket'])
            suggestions['accessories'].extend(['Winter hat', 'Gloves', 'Scarf', 'Warm socks', 'Winter boots'])
        elif temp_f < 45:
            suggestions['top'].extend(['Long-sleeve shirt', 'Sweater'])
            suggestions['bottom'].extend(['Warm pants', 'Jeans'])
            suggestions['outerwear'].extend(['Winter coat', 'Heavy jacket'])
            suggestions['accessories'].extend(['Hat', 'Gloves', 'Scarf', 'Warm socks'])
        elif temp_f < 60:
            suggestions['top'].extend(['Long-sleeve shirt', 'Light sweater'])
            suggestions['bottom'].extend(['Pants', 'Jeans'])
            suggestions['outerwear'].extend(['Light jacket', 'Sweatshirt'])
            suggestions['accessories'].extend(['Light scarf', 'Closed-toe shoes'])
        elif temp_f < 75:
            suggestions['top'].extend(['Short-sleeve shirt', 'Light long-sleeve shirt'])
            suggestions['bottom'].extend(['Pants', 'Jeans', 'Shorts'])
            suggestions['outerwear'].extend(['Light jacket (optional)'])
            suggestions['accessories'].extend(['Comfortable shoes'])
        else:
            suggestions['top'].extend(['Short-sleeve shirt', 'Tank top'])
            suggestions['bottom'].extend(['Shorts', 'Light pants'])
            suggestions['outerwear'].extend(['Light cover-up (optional)'])
            suggestions['accessories'].extend(['Sunglasses', 'Hat', 'Sunscreen'])
            
        return suggestions

    def get_coordinates(self, city):
        """Get coordinates for a city using OpenWeatherMap's geocoding API."""
        try:
            # Clean up the city name and format it for the API
            city = city.strip()
            if ',' in city:
                city, state = [part.strip() for part in city.split(',')]
                query = f"{city},{state},US"
            else:
                query = f"{city},US"
            
            # Make the geocoding request
            print(f"\n=== Geocoding Request ===")
            print(f"City: {query}")
            print(f"URL: {self.geocode_url}")
            params = {
                'q': query,
                'limit': 1,
                'appid': self.api_key
            }
            print(f"Params: {params}")
            
            response = requests.get(self.geocode_url, params=params)
            print(f"\n=== Geocoding Response ===")
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"\n=== Parsed Response ===")
                print(f"Data: {data}")
                if data and len(data) > 0:
                    location = data[0]
                    return {
                        'lat': location['lat'],
                        'lon': location['lon']
                    }
            
            print(f"\n=== Error ===")
            print(f"Could not find coordinates for: {query}")
            return None
            
        except Exception as e:
            print(f"\n=== Exception ===")
            print(f"Error: {str(e)}")
            return None

    def get_weather(self, city):
        try:
            print(f"\n=== Weather Request ===")
            print(f"City: {city}")
            
            # First get coordinates
            coordinates = self.get_coordinates(city)
            if not coordinates:
                return {'error': f'Could not find coordinates for city: {city}'}

            # Then get weather using coordinates
            weather_url = f"{self.base_url}/weather"
            params = {
                'lat': coordinates['lat'],
                'lon': coordinates['lon'],
                'appid': self.api_key,
                'units': 'metric'  # Get temperature in Celsius
            }
            print(f"\n=== Weather API Request ===")
            print(f"URL: {weather_url}")
            print(f"Params: {params}")
            
            response = requests.get(weather_url, params=params)
            print(f"\n=== Weather API Response ===")
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code != 200:
                print(f"\n=== Weather API Error ===")
                print(f"Error: {response.text}")
                return {'error': f'Weather API error: {response.text}'}
            
            data = response.json()
            
            # Convert Celsius to Fahrenheit
            if 'main' in data:
                temp_c = data['main']['temp']
                feels_like_c = data['main']['feels_like']
                temp_min_c = data['main']['temp_min']
                temp_max_c = data['main']['temp_max']
                
                # Convert to Fahrenheit
                temp_f = round((temp_c * 9/5) + 32, 1)
                feels_like_f = round((feels_like_c * 9/5) + 32, 1)
                temp_min_f = round((temp_min_c * 9/5) + 32, 1)
                temp_max_f = round((temp_max_c * 9/5) + 32, 1)
                
                # Add Fahrenheit temperatures to the response
                data['main']['temp_f'] = temp_f
                data['main']['feels_like_f'] = feels_like_f
                data['main']['temp_min_f'] = temp_min_f
                data['main']['temp_max_f'] = temp_max_f
                
                # Add clothing suggestions based on the current temperature
                data['clothing_suggestions'] = self.get_clothing_suggestions(temp_f)
                
            return data
            
        except Exception as e:
            print(f"\n=== Weather Exception ===")
            print(f"Error: {str(e)}")
            return {'error': f'Failed to get weather data: {str(e)}'} 