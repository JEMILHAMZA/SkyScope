
document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "PUT YOUR OpenWeatherMap API KEY HERE";
  const input = document.getElementById("user_location");
  const converter = document.getElementById("converter");
  const searchIcon = document.querySelector(".fa-search");
  const loadingElement = document.getElementById("loading"); // Loading spinner element
  const highlightsElement = document.getElementById("highlights"); // Highlights div
  const highlightsElement2 = document.getElementById("highlights-2"); // Highlights div
  const weatherContentElement = document.getElementById("weather_content"); // Weather content div
  const errorMessageElement = document.getElementById("error-message"); // Error message element
  const prevPageButton = document.getElementById("prevPage"); // Previous page button
  const nextPageButton = document.getElementById("nextPage"); // Next page button

  const CACHE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
  let currentPage = 0; // Current page index
  let forecastData = []; // Store forecast data for pagination

  // Show loading spinner and hide everything else
  const showLoading = () => {
    loadingElement.style.display = "block";
    highlightsElement.style.display = "none"; 
    highlightsElement2.style.display = "none"; 
    weatherContentElement.style.display = "none"; 
    errorMessageElement.style.display = "none";
  };

  // Hide loading spinner and show Highlights and Weather Content
  const showHighlights = () => {
    loadingElement.style.display = "none";
    highlightsElement.style.display = "grid"; 
    highlightsElement2.style.display = "grid"; 
    weatherContentElement.style.display = "block"; 
    errorMessageElement.style.display = "none"; 
  };

  // Show error message and hide everything else
  const showError = (message) => {
    loadingElement.style.display = "none";
    highlightsElement.style.display = "none"; 
    highlightsElement2.style.display = "none"; 
    weatherContentElement.style.display = "none"; 
    errorMessageElement.innerText = message; 
    errorMessageElement.style.display = "block"; 
  };

  // Store data in localStorage with a timestamp
  const storeInLocalStorage = (key, data) => {
    const item = {
      data: data,
      timestamp: new Date().getTime(),
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

  // Retrieve data from localStorage if it's not expired
  const getFromLocalStorage = (key) => {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const parsedItem = JSON.parse(item);
    const now = new Date().getTime();

    if (now - parsedItem.timestamp > CACHE_EXPIRATION_TIME) {
      localStorage.removeItem(key);
      return null;
    }

    return parsedItem.data;
  };

  // Fetch weather data for the user's input location
  const findUserLocation = async () => {
    showLoading(); // Show loading spinner and hide everything else
    const location = input.value;
    const unit = converter.value === "°C" ? "metric" : "imperial";
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&appid=${apiKey}`;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=${unit}&appid=${apiKey}`;
  
    try {
      let weatherData = getFromLocalStorage(`weather_${location}_${unit}`);
      let uvData = getFromLocalStorage(`uv_${location}_${unit}`);
      let forecastResponse = getFromLocalStorage(`forecast_${location}_${unit}`);
  
      if (!weatherData) {
        const weatherResponse = await fetch(weatherApiUrl);
        if (!weatherResponse.ok) {
          throw new Error("City not found. Please try again.");
        }
        weatherData = await weatherResponse.json();
        storeInLocalStorage(`weather_${location}_${unit}`, weatherData);
      }
  
      updateWeather(weatherData);
  
      const { lat, lon } = weatherData.coord;
      if (!uvData) {
        const uvApiUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const uvResponse = await fetch(uvApiUrl);
        if (!uvResponse.ok) {
          throw new Error("Failed to fetch UV data.");
        }
        uvData = await uvResponse.json();
        storeInLocalStorage(`uv_${location}_${unit}`, uvData);
      }
  
      updateUVIndex(uvData);
  
      if (!forecastResponse) {
        const response = await fetch(forecastApiUrl); 
        if (!response.ok) {
          throw new Error("Failed to fetch forecast data.");
        }
        forecastResponse = await response.json(); 
        storeInLocalStorage(`forecast_${location}_${unit}`, forecastResponse);
      }
  
      forecastData = forecastResponse.list; // Store forecast data for pagination
      updateForecast(forecastData); // Update forecast with pagination
  
      showHighlights(); // Show Highlights and Weather Content if no errors
    } catch (error) {
      console.error("Error fetching weather data:", error);
      showError(error.message);
    }
  
    setTimeout(() => {
      weatherContentElement.style.opacity = 1;
      weatherContentElement.classList.add("slide-right");
    }, 0);
  };

  // Fetch weather data for the user's current location
  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      showLoading(); // Show loading spinner and hide everything else
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const unit = converter.value === "°C" ? "metric" : "imperial";
          const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
          const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;

          try {
            let weatherData = getFromLocalStorage(`weather_${lat}_${lon}_${unit}`);
            let uvData = getFromLocalStorage(`uv_${lat}_${lon}_${unit}`);
            let forecastResponse = getFromLocalStorage(`forecast_${lat}_${lon}_${unit}`);

            if (!weatherData) {
              const weatherResponse = await fetch(weatherApiUrl);
              if (!weatherResponse.ok) {
                throw new Error("Failed to fetch weather data.");
              }
              weatherData = await weatherResponse.json();
              storeInLocalStorage(`weather_${lat}_${lon}_${unit}`, weatherData);
            }

            updateWeather(weatherData);

            if (!uvData) {
              const uvApiUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
              const uvResponse = await fetch(uvApiUrl);
              if (!uvResponse.ok) {
                throw new Error("Failed to fetch UV data.");
              }
              uvData = await uvResponse.json();
              storeInLocalStorage(`uv_${lat}_${lon}_${unit}`, uvData);
            }

            updateUVIndex(uvData);

            if (!forecastResponse) {
              const response = await fetch(forecastApiUrl);
              if (!response.ok) {
                throw new Error("Failed to fetch forecast data.");
              }
              forecastResponse = await response.json();
              storeInLocalStorage(`forecast_${lat}_${lon}_${unit}`, forecastResponse);
            }

            forecastData = forecastResponse.list; // Store forecast data for pagination
            updateForecast(forecastData); // Update forecast with pagination

            showHighlights(); // Show Highlights and Weather Content if no errors
          } catch (error) {
            console.error("Error fetching weather data:", error);
            showError(error.message); 
          }

          setTimeout(() => {
            weatherContentElement.style.opacity = 1;
            weatherContentElement.classList.add("slide-right");
          }, 0);
        },
        (error) => {
          console.error("Error getting location:", error);
          showError("Failed to get your location. Please try again."); 
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      showError("Geolocation is not supported by your browser."); 
    }
  };

  // Update the weather information in the DOM
  const updateWeather = (data) => {
    document.querySelector(".temprature").innerText = `${data.main.temp} ${converter.value}`;
    document.querySelector(".feelslike").innerText = `Feels like: ${data.main.feels_like} ${converter.value}`;
    document.querySelector(".discription").innerText = data.weather[0].description;
    document.querySelector(".date").innerText = new Date().toLocaleDateString();
    document.querySelector(".city").innerText = data.name;
    document.getElementById("Hvalue").innerText = `${data.main.humidity}%`;
    document.getElementById("Wvalue").innerText = `${data.wind.speed} m/s`;
    document.getElementById("Cvalue").innerText = `${data.clouds.all}%`;
    document.getElementById("Pvalue").innerText = `${data.main.pressure} hPa`;
    document.getElementById("SRvalue").innerText = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    document.getElementById("SSvalue").innerText = new Date(data.sys.sunset * 1000).toLocaleTimeString();

    const weatherIcon = document.querySelector(".weather_icon");
    const iconCode = data.weather[0].icon;
    weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon">`;

    const weatherBg = document.querySelector(".weather-bg");
    const weatherCondition = data.weather[0].main.toLowerCase();
    updateBackground(weatherBg, weatherCondition);
  };

  // Update the UV index in the DOM
  const updateUVIndex = (data) => {
    document.getElementById("UVvalue").innerText = data.value;
  };

  // Update the forecast in the DOM with pagination
  const updateForecast = (data) => {
    const forecastElement = document.querySelector(".forecast");
    forecastElement.innerHTML = "";

    const dailyData = [];
    const seenDates = new Set();

    data.forEach((entry) => {
      const dateObj = new Date(entry.dt * 1000);
      const dateString = dateObj.toISOString().split("T")[0];

      if (!seenDates.has(dateString)) {
        dailyData.push(entry);
        seenDates.add(dateString);
      }
    });

    const startIndex = currentPage * 3;
    const endIndex = startIndex + 3;
    const paginatedData = dailyData.slice(startIndex, endIndex);

    paginatedData.forEach((day) => {
      const dateObj = new Date(day.dt * 1000);
      const date = dateObj.toLocaleDateString();
      const dayName = dateObj.toLocaleDateString(undefined, { weekday: "long" });
      const iconCode = day.weather[0].icon;
      const temp = day.main.temp;
      const description = day.weather[0].description;

      const dayElement = document.createElement("div");
      dayElement.classList.add("forecast-day", "rounded-2xl", "p-4", "hover:scale-[98%]", "hover:ease-in-out", "hover:duration-300");

      dayElement.innerHTML = `
        <div class="date">${dayName}, ${date}</div>
        <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon">
        <div class="temp">${temp} ${converter.value}</div>
        <div class="description">${description}</div>
      `;

      forecastElement.appendChild(dayElement);
    });

    // Enable/disable pagination buttons based on current page
    prevPageButton.disabled = currentPage === 0;
    nextPageButton.disabled = endIndex >= dailyData.length;
  };

  // Update the background image based on weather condition
  const updateBackground = (element, condition) => {
    const backgrounds = {
      clear: "url('assets/images/sunny.jpg')",
      clouds: "url('assets/images/cloudy.jpg')",
      rain: "url('assets/images/rainny.jpg')",
      snow: "url('assets/images/snow.jpg')",
      thunderstorm: "url('assets/images/thunder1.jpg')",
      drizzle: "url('assets/images/drizzle.jpg')",
      mist: "url('assets/images/mist.jpg')",
    };

    element.style.backgroundImage = backgrounds[condition] || "url('assets/images/w.jpg')";
    element.style.backgroundSize = "cover";
    element.style.backgroundPosition = "center";
    element.style.backgroundRepeat = "no-repeat";
    element.style.backgroundTransition = "ease-in-out";
  };

  // Event listeners
  searchIcon.addEventListener("click", findUserLocation);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      findUserLocation();
    }
  });

  document.querySelector(".current_location").addEventListener("click", getCurrentLocationWeather);

  // Pagination button event listeners
  prevPageButton.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      updateForecast(forecastData);
    }
  });

  nextPageButton.addEventListener("click", () => {
    if ((currentPage + 1) * 3 < forecastData.length) {
      currentPage++;
      updateForecast(forecastData);
    }
  });
});

// Slide in weather output on page load
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".weather_output").classList.add("slide-left");
});