document.addEventListener('DOMContentLoaded', function () {
    // Variables and Constants
    const apiKey = "38d147031dc4e997fc0b84ac609f3f86";
    const mainElement = document.getElementById('main');
    const formElement = document.getElementById('form');
    const searchElement = document.getElementById('search');
    const toggleButtonElement = document.getElementById('toggle');
    let isCelsius = true;

    let currentWeatherData = null;
    let currentForecastData = null;

    // Utility Functions
    function toCelsius(K) {
        return Math.floor(K - 273.15);
    }

    function toFahrenheit(K) {
        return Math.floor((K - 273.15) * 9 / 5 + 32);
    }

    // API URL Builders
    const buildWeatherUrl = (city) => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const buildForecastUrl = (city) => `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetch and Display Functions
    async function fetchAndDisplayWeather(city) {
        const response = await fetch(buildWeatherUrl(city));
        const data = await response.json();
        currentWeatherData = data;
        addWeatherToPage(data);
    }

    async function fetchAndDisplayForecast(city) {
        const response = await fetch(buildForecastUrl(city));
        const data = await response.json();
        currentForecastData = data;
        addForecastToPage(data);
    }

    function addWeatherToPage(data) {
        const tempUnit = isCelsius ? "°C" : "°F";
        const tempValue = isCelsius ? toCelsius(data.main.temp) : toFahrenheit(data.main.temp);

        const date = new Date();
        const time = `${date.getHours()}:${date.getMinutes()}`;

        const weatherDiv = document.createElement('div');
        weatherDiv.classList.add('weather');
        weatherDiv.innerHTML = `
            <div id="current-time-date">
                <div>Date: <span id="current-date">${date.toDateString()}</span></div>
                <div>Time: <span id="current-time">${time}</span></div>
            </div>
            <h2><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
            ${tempValue}${tempUnit}</h2>
            <small>${data.weather[0].main}</small>
        `;

        mainElement.innerHTML = "";
        mainElement.appendChild(weatherDiv);
    }

    function addForecastToPage(data) {
        const forecastContainer = document.createElement('div');
        forecastContainer.id = 'forecast-container';

        for (let i = 0; i < data.list.length; i += 8) {
            const dayData = data.list[i];
            const tempValue = isCelsius ? toCelsius(dayData.main.temp) : toFahrenheit(dayData.main.temp);
            const tempUnit = isCelsius ? "°C" : "°F";

            const date = new Date(dayData.dt * 1000);
            const formattedDate = date.toISOString().split('T')[0];

            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day-forecast');
            dayDiv.innerHTML = `
                <h3>${formattedDate}</h3>
                <div class="temp">Temperature: <span class="temp">${tempValue}${tempUnit}</span></div>
                <div class="description">Description: <span class="description">${dayData.weather[0].main}</span></div>
            `;
            forecastContainer.appendChild(dayDiv);
        }

        mainElement.appendChild(forecastContainer);
    }

    function refreshDisplay() {
        if (currentWeatherData) {
            addWeatherToPage(currentWeatherData);
        }
        if (currentForecastData) {
            addForecastToPage(currentForecastData);
        }
    }

    // Event Handlers
    formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = searchElement.value;
        if (city) {
            fetchAndDisplayWeather(city);
            fetchAndDisplayForecast(city);
        }
    });

    toggleButtonElement.addEventListener('click', () => {
        isCelsius = !isCelsius;
        refreshDisplay();
    });
});
