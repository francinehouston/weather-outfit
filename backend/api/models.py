from django.db import models
from django.utils import timezone

# Create your models here.

class FavoriteCity(models.Model):
    name = models.CharField(max_length=100)
    coordinates = models.CharField(max_length=50)  # Store lat,lon
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Favorite Cities"

class WeatherHistory(models.Model):
    city = models.CharField(max_length=100)
    temperature = models.FloatField()
    humidity = models.FloatField()
    wind_speed = models.FloatField()
    cloud_cover = models.FloatField()
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.city} - {self.timestamp}"

    class Meta:
        verbose_name_plural = "Weather History"
