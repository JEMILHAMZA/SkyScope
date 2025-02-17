# SkyScope - Weather App

SkyScope is a simple front-end web application that fetches and displays weather data from the **OpenWeatherMap API**. It provides real-time weather information, including temperature, humidity, wind speed, UV index, and more. The app also includes a 5-day weather forecast with pagination, animations, and transitions for a smooth user experience.

## Features

### Core Functionality
- **API Integration**: Fetches real-time weather data and forecasts from the OpenWeatherMap API.
- **Search/Filter**: Users can search for weather information by city name.
- **Responsive UI**: Clean and intuitive user interface designed with CSS and Tailwind CSS.
- **Error Handling**: Displays meaningful error messages when the API call fails or the city is not found.
- **Dynamic Content Rendering**: Uses JavaScript to dynamically update the DOM with weather data.

### Additional Features
- **Pagination**: The 5-day forecast is paginated, allowing users to navigate through the days.
- **Local Storage Cache**: Caches API responses to reduce unnecessary API calls and improve performance.
- **Animations/Transitions**: Smooth animations and transitions for UI elements.
- **Current Location**: Fetches weather data for the user's current location using the Geolocation API.
- **Temperature Scale Conversion**: Users can switch between Celsius (°C) and Fahrenheit (°F) scales.

## How to Run the Project

### Prerequisites
1. **OpenWeatherMap API Key**: 
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api) to get your free API key.
   - Replace `"PUT YOUR OpenWeatherMap API KEY HERE"` in the `script.js` file with your actual API key.

2. **Live Server**:
   - Use a live server extension in your code editor (e.g., VS Code) to run the project locally.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/JEMILHAMZA/SkyScope.git
   ```
2. Navigate to the project directory:
   ```bash
   cd SkyScope
   ```
3. Open the `index.html` file in your browser or use a live server to run the project.

4. Enter a city name in the search bar or click the location icon to fetch weather data for your current location.

## Code Structure
- **`index.html`**: Contains the HTML structure of the app.
- **`script.js`**: Handles API integration, DOM manipulation, and local storage caching.
- **`css/style.css`**: Contains custom styles for the app.
- **`assets/`**: Includes images and icons used in the app.

## API Details
- **OpenWeatherMap API**:
  - Used to fetch real-time weather data and forecasts.
  - API Documentation: [OpenWeatherMap API Docs](https://openweathermap.org/api)



