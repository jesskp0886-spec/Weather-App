const API_KEY = "763db599c635f1bd0a68df3ec7aa9d1b";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const weather = document.getElementById("weather");

const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const weatherType = document.getElementById("weatherType");
const cityName = document.getElementById("cityName");
const latitude = document.getElementById("latitude");
const longitude = document.getElementById("longitude");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const forecastContainer = document.getElementById("forecastContainer");
const currentDate = document.getElementById("currentDate");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
});

cityInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") searchBtn.click();
});

function showLoading() {
    loading.classList.remove("hidden");
    weather.classList.add("hidden");
    error.classList.add("hidden");
}

function hideLoading() {
    loading.classList.add("hidden");
}

function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDate.textContent = now.toLocaleDateString('en-US', options);
}

async function getWeather(city) {
    showLoading();
    try {
        const res = await fetch(`${WEATHER_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        displayWeather(data);
        getForecast(city);
        updateDate();
    } catch (err) {
        error.classList.remove("hidden");
        error.querySelector("p").textContent = "City not found";
    }
    hideLoading();
}

function displayWeather(data) {
    weather.classList.remove("hidden");
    temperature.innerHTML = `${Math.round(data.main.temp)}<sup>°C</sup>`;
    weatherType.textContent = data.weather[0].description;
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    latitude.textContent = data.coord.lat.toFixed(4);
    longitude.textContent = data.coord.lon.toFixed(4);
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${data.wind.speed} m/s`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
}

async function getForecast(city) {
    const res = await fetch(`${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await res.json();
    forecastContainer.innerHTML = "";
    const days = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    days.slice(0, 5).forEach(day => {
        const date = new Date(day.dt_txt);
        forecastContainer.innerHTML += `
            <div class="f-card">
                <p class="day">${date.toLocaleDateString("en-US", { weekday: "short" })}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].main}">
                <div>
                    <span class="hi">${Math.round(day.main.temp)}°</span>
                    <span class="lo">${Math.round(day.main.temp_min)}°</span>
                </div>
                <p class="cond">${day.weather[0].main}</p>
            </div>
        `;
    });
}

getWeather("London");