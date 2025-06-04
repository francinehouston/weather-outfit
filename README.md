# Weather Outfit

A full-stack web application that provides weather information and clothing suggestions based on the current weather conditions.

## Features

- Real-time weather data using OpenWeatherMap API
- Temperature in both Celsius and Fahrenheit
- Detailed weather information including humidity and wind speed
- Smart clothing suggestions based on temperature
- Modern, responsive UI built with React and Material-UI

## Tech Stack

### Frontend
- React
- Material-UI
- Axios for API calls

### Backend
- Django
- Django REST Framework
- Python-dotenv for environment variables

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with your OpenWeatherMap API key:
   ```
   OPENWEATHER_API_KEY=your_api_key_here
   ```

5. Run the Django server:
   ```bash
   python manage.py runserver 3002
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at http://localhost:3000

## Environment Variables

- `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key (required for backend)

## License

MIT 