// Function to create the weather wContainer
function createWeatherweatherContainer() {
    const weatherContainerContainer = document.getElementById('wContainer-container');

    // Create the wContainer elements
    const weatherContainerTitle = document.createElement('h2');
    weatherContainerTitle.textContent = '';

    const locationInfo = document.createElement('p');
    locationInfo.id = 'location-info';
    locationInfo.textContent =  '';

    const weatherInfo = document.createElement('p');
    weatherInfo.id = 'weather-info';
    weatherInfo.textContent = '';

    // Append the elements to the wContainer container
    weatherContainerContainer.appendChild(weatherContainerTitle);
    weatherContainerContainer.appendChild(locationInfo);
    weatherContainerContainer.appendChild(weatherInfo);

    // Function to fetch and update location data based on latitude and longitude
    async function getLocationData(latitude, longitude) {
        const apiKey = '38d147031dc4e997fc0b84ac609f3f86';
        const locationUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
        const response = await fetch(locationUrl);
        const data = await response.json();
        return data[0];
    }

    // Function to fetch and update weather data based on latitude and longitude
    async function getWeatherData(latitude, longitude) {
        const apiKey = '38d147031dc4e997fc0b84ac609f3f86';
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
        const response = await fetch(weatherUrl);
        const data = await response.json();
        return data;
    }

    // Function to update the wContainer with the fetched data
    async function updateweatherContainer(latitude, longitude) {
        const locationData = await getLocationData(latitude, longitude);
        const weatherData = await getWeatherData(latitude, longitude);

        document.getElementById('location-info').textContent = `Location: ${locationData.name}, ${locationData.country}`;
        const temperature = Math.round(weatherData.main.temp - 273.15);
        const description = weatherData.weather[0].description;
        document.getElementById('weather-info').textContent = `Weather: ${temperature}°C, ${description}`;
    }

    // Get user's current geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            await updateweatherContainer(latitude, longitude);
        });
    }
}

// Function to add the weather map to the page
function addWeatherMap() {
    const apiKey = '38d147031dc4e997fc0b84ac609f3f86';
    const map = L.map('weather-map').setView([51.505, -0.09], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
        attribution: 'Weather data &copy; OpenWeatherMap'
    }).addTo(map);
}

// Create the weather wContainer
createWeatherweatherContainer();

// Add the weather map
addWeatherMap();
