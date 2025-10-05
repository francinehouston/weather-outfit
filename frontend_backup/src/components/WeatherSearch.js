import React, { useState } from 'react';
import { 
    TextField, 
    Button, 
    Card, 
    CardContent, 
    Typography,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';
import axios from 'axios';

const WeatherSearch = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // API URL - use environment variable or fallback to localhost
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002';

    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        },
        searchContainer: {
            display: 'flex',
            gap: '15px',
            marginBottom: '30px',
            width: '100%',
            maxWidth: '600px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        weatherCard: {
            width: '100%',
            maxWidth: '800px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            overflow: 'hidden',
        },
        weatherHeader: {
            background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
            color: 'white',
            padding: '30px',
            textAlign: 'center',
            position: 'relative',
        },
        weatherIcon: {
            fontSize: '4rem',
            marginBottom: '10px',
        },
        temperature: {
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '10px',
        },
        cityName: {
            fontSize: '1.5rem',
            marginBottom: '10px',
        },
        weatherDescription: {
            fontSize: '1.2rem',
            opacity: 0.9,
        },
        weatherDetails: {
            padding: '30px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
        },
        detailItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '15px',
            backgroundColor: 'rgba(116, 185, 255, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(116, 185, 255, 0.2)',
        },
        detailIcon: {
            fontSize: '1.5rem',
            color: '#0984e3',
        },
        clothingSuggestions: {
            marginTop: '20px',
            padding: '30px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '15px',
            border: '1px solid rgba(116, 185, 255, 0.2)',
        },
        suggestionCategory: {
            marginBottom: '25px',
        },
        suggestionCategoryTitle: {
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#2d3436',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
        },
        suggestionList: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '10px',
        },
        suggestionItem: {
            padding: '10px 15px',
            backgroundColor: 'rgba(116, 185, 255, 0.1)',
            borderRadius: '8px',
            color: '#2d3436',
            fontSize: '0.9rem',
            border: '1px solid rgba(116, 185, 255, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
                backgroundColor: 'rgba(116, 185, 255, 0.2)',
                transform: 'translateY(-2px)',
            },
        },
        searchButton: {
            background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
            color: 'white',
            padding: '12px 30px',
            borderRadius: '25px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 15px rgba(116, 185, 255, 0.4)',
            },
        },
        searchInput: {
            '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '25px',
                '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#74b9ff',
                },
            },
        },
    };

    const getWeatherIcon = (weatherCode) => {
        // Map weather codes to emoji icons
        const weatherIcons = {
            '01': '☀️', // clear sky
            '02': '⛅', // few clouds
            '03': '☁️', // scattered clouds
            '04': '☁️', // broken clouds
            '09': '🌧️', // shower rain
            '10': '🌦️', // rain
            '11': '⛈️', // thunderstorm
            '13': '❄️', // snow
            '50': '🌫️', // mist
        };
        
        const code = weatherCode?.toString().substring(0, 2);
        return weatherIcons[code] || '🌤️';
    };

    const getCategoryIcon = (category) => {
        const icons = {
            top: '👕',
            bottom: '👖',
            outerwear: '🧥',
            accessories: '🧢',
        };
        return icons[category] || '👕';
    };

    const handleSearch = async () => {
        if (!city.trim()) {
            setError('Please enter a city name');
            return;
        }

        setLoading(true);
        setError(null);
        setWeather(null);

        try {
            console.log('Fetching weather for:', city);
            const response = await axios.get(`${API_BASE_URL}/api/weather/?city=${encodeURIComponent(city)}`);
            console.log('Weather response:', response.data);
            setWeather(response.data);
        } catch (err) {
            console.error('Error fetching weather:', err);
            if (err.response) {
                setError(err.response.data.error || 'Failed to fetch weather data');
            } else if (err.request) {
                setError('No response from server. Please check if the backend is running.');
            } else {
                setError('Error setting up the request');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.searchContainer}>
                <TextField
                    label="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyPress={handleKeyPress}
                    variant="outlined"
                    fullWidth
                    sx={styles.searchInput}
                />
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={loading}
                    sx={styles.searchButton}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Search'}
                </Button>
            </div>

            {error && (
                <Alert severity="error" style={{ marginBottom: '20px', width: '100%', maxWidth: '600px' }}>
                    {error}
                </Alert>
            )}

            {weather && (
                <Card style={styles.weatherCard}>
                    <div style={styles.weatherHeader}>
                        <div style={styles.weatherIcon}>
                            {getWeatherIcon(weather.weather?.[0]?.id)}
                        </div>
                        <Typography style={styles.temperature}>
                            {Math.round(weather.main.temp_f)}°F
                        </Typography>
                        <Typography style={styles.cityName}>
                            {city}
                        </Typography>
                        <Typography style={styles.weatherDescription}>
                            {weather.weather?.[0]?.description}
                        </Typography>
                    </div>
                    
                    <div style={styles.weatherDetails}>
                        <div style={styles.detailItem}>
                            <span style={styles.detailIcon}>🌡️</span>
                            <div>
                                <div>Feels like: {Math.round(weather.main.feels_like_f)}°F</div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                                    Min: {Math.round(weather.main.temp_min_f)}°F | Max: {Math.round(weather.main.temp_max_f)}°F
                                </div>
                            </div>
                        </div>
                        
                        <div style={styles.detailItem}>
                            <span style={styles.detailIcon}>💧</span>
                            <div>
                                <div>Humidity: {weather.main.humidity}%</div>
                            </div>
                        </div>
                        
                        <div style={styles.detailItem}>
                            <span style={styles.detailIcon}>💨</span>
                            <div>
                                <div>Wind: {weather.wind.speed} m/s</div>
                            </div>
                        </div>
                    </div>
                    
                    {weather.clothing_suggestions && (
                        <div style={styles.clothingSuggestions}>
                            <Typography variant="h6" gutterBottom style={{ color: '#2d3436', marginBottom: '20px' }}>
                                🌤️ Suggested Clothing
                            </Typography>
                            {Object.entries(weather.clothing_suggestions).map(([category, items]) => (
                                <div key={category} style={styles.suggestionCategory}>
                                    <Typography style={styles.suggestionCategoryTitle}>
                                        {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </Typography>
                                    <ul style={styles.suggestionList}>
                                        {items.map((item, index) => (
                                            <li key={`${category}-${index}`} style={styles.suggestionItem}>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};

export default WeatherSearch; 