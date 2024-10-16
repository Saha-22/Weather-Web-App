// Add event listener to the search button, which triggers when clicked
document.getElementById('searchBtn').addEventListener('click', () => {
    // Get the location entered by the user and remove extra spaces
    const location = document.getElementById('location').value.trim();

    // Regular expression to validate if the location contains only letters, spaces, or dashes
    const cityNamePattern = /^[a-zA-Z\s-]+$/;

    // If no location is entered, show an alert
    if (!location) {
        alert('Please enter a location');
    } 
    // If location format is invalid, show an alert
    else if (!cityNamePattern.test(location)) {
        alert('Please enter a valid city name (avoid area names or special characters).');
    } 
    // If location is valid, fetch weather data
    else {
        fetchWeatherData(location);
    }
});

let timeoutId;
// Add another event listener for debounce functionality to prevent multiple API calls
document.getElementById('searchBtn').addEventListener('click', () => {
    // Clear any existing timeout to prevent unnecessary duplicate API calls
    clearTimeout(timeoutId); 

    // Set a timeout to delay the API call by 200ms for smooth user experience
    timeoutId = setTimeout(() => {
        const location = document.getElementById('location').value.trim();

        const cityNamePattern = /^[a-zA-Z\s-]+$/;
        if (!location) {
            alert('Please enter a location');
        } else if (!cityNamePattern.test(location)) {
            alert('Please enter a valid city name (avoid area names or special characters).');
        } else {
            fetchWeatherData(location); // Call the weather API if input is valid
        }
    }, 200); // 200ms delay
});

// Function to fetch weather data from the API
async function fetchWeatherData(location) {
    const apiKey = '709921c6874a417097c123120241610'; // my WeatherAPI key
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`; // API URL

    try {
        // Fetch the weather data from the API
        const response = await fetch(url);

        // Handle errors based on response status codes
        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('Invalid request. Please check the location entered.');
            } else if (response.status === 401) {
                throw new Error('Unauthorized. Check your API key.');
            } else if (response.status === 404) {
                throw new Error('Location not found. Please try another city name.');
            } else {
                throw new Error('Something went wrong. Please try again later.');
            }
        }

        const data = await response.json(); // Parse the response as JSON
        displayWeatherData(data); // Display weather data on the UI

    } catch (error) {
        // Display error message on the page if something goes wrong
        document.getElementById('weather-container').innerHTML = `<p class="error">${error.message}</p>`;
    }
}

// Function to display weather data on the page
function displayWeatherData(data) {
    const weatherContainer = document.getElementById('weather-container');
    const isDay = data.current.is_day; // Check if it's day (1) or night (0)
    const temperature = data.current.temp_c; // Get current temperature in Celsius
    const condition = data.current.condition.text.toLowerCase(); // Get weather condition text

    // Clear previous weather condition animations
    document.body.className = '';

    // Apply the corresponding animation based on weather condition and time of day
    setTimeout(() => {
        if (isDay) {
            document.body.classList.add('day'); // Apply day mode
            if (condition.includes('sunny')) {
                document.body.classList.add('sunny');
            } else if (condition.includes('cloudy')) {
                document.body.classList.add('cloudy');
            } else if (condition.includes('rain')) {
                document.body.classList.add('rainy');
            }
        } else {
            document.body.classList.add('night'); // Apply night mode
            if (condition.includes('clear')) {
                document.body.classList.add('clear-night');
            } else if (condition.includes('cloudy')) {
                document.body.classList.add('cloudy-night');
            } else if (condition.includes('rain')) {
                document.body.classList.add('rainy-night');
            }
        }
    }, 100); // Short delay for smooth animation

    // Update the weather information displayed on the page
    weatherContainer.innerHTML = `
        <div class="weather-info">
            <h2>${data.location.name}, ${data.location.country}</h2>
            <p><strong>Temperature:</strong> ${temperature}°C</p>
            <p><strong>Condition:</strong> ${data.current.condition.text}</p>
            <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${data.current.wind_kph} kph</p>
        </div>
    `;
}
