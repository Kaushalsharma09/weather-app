const apiKey = "6576fdfa927f4313b869ec308823ea76"; // Replace with your actual OpenWeatherMap API key

// 🌍 Fetch by city name
async function getWeather(city = null) {
  const input = document.getElementById("cityInput");
  city = city || input.value.trim();
  if (!city) return;

  const unit = isCelsius ? "metric" : "imperial";
  const lang = currentLang;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${unit}&lang=${lang}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found.");
    const data = await response.json();
    renderWeather(data);
  } catch (error) {
    document.getElementById("weatherDisplay").innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

// 📍 Fetch by coordinates
async function getWeatherByCoords(lat, lon) {
  const unit = isCelsius ? "metric" : "imperial";
  const lang = currentLang;

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}&lang=${lang}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Location not found.");
    const data = await response.json();
    renderWeather(data);
  } catch (error) {
    document.getElementById("weatherDisplay").innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

// 🌦️ Render weather card
function renderWeather(data) {
  const display = document.getElementById("weatherDisplay");
  const { name, sys, main, weather, wind, timezone } = data;
  const iconCode = weather[0].icon;
  const weatherType = weather[0].main.toLowerCase();
  const windDir = wind.deg;

  updateLocalTime(timezone);
  drawCompass(windDir);
  setWeatherBackground(weatherType);
  playWeatherSound(weatherType);

  display.innerHTML = `
    <h3>${name}, ${sys.country}</h3>
    <img class="weather-icon" src="https://openweathermap.org/img/wn/${iconCode}@2x.png" />
    <p><strong>${weather[0].description}</strong></p>
    <p>Temperature: ${main.temp}°${isCelsius ? "C" : "F"}</p>
    <p>Feels like: ${main.feels_like}°</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Pressure: ${main.pressure} hPa</p>
    <p>Visibility: ${data.visibility / 1000} km</p>
    <p>Wind: ${wind.speed} ${isCelsius ? "m/s" : "mph"}</p>
    <p>${getClothingAdvice(main.temp)}</p>
  `;
}

// 🎵 Background weather sounds
function playWeatherSound(type) {
  const audio = document.getElementById("weatherAudio");
  const sounds = {
    clear: "assets/sounds/birds.mp3",
    rain: "assets/sounds/rain.mp3",
    drizzle: "assets/sounds/rain.mp3",
    thunderstorm: "assets/sounds/storm.mp3",
    snow: "assets/sounds/wind.mp3"
  };
  const src = sounds[type] || "";
  if (src) {
    audio.src = src;
    audio.play();
  } else {
    audio.pause();
    audio.src = "";
  }
}

// 🎨 Background color based on weather
function setWeatherBackground(type) {
  const body = document.getElementById("body");
  switch (type) {
    case 'clear':
      body.style.background = 'linear-gradient(to right, #fceabb, #f8b500)';
      break;
    case 'clouds':
      body.style.background = 'linear-gradient(to right, #bdc3c7, #2c3e50)';
      break;
    case 'rain':
    case 'drizzle':
      body.style.background = 'linear-gradient(to right, #4b79a1, #283e51)';
      break;
    case 'thunderstorm':
      body.style.background = 'linear-gradient(to right, #232526, #414345)';
      break;
    case 'snow':
      body.style.background = 'linear-gradient(to right, #e6dada, #274046)';
      break;
    default:
      body.style.background = 'linear-gradient(to right, #83a4d4, #b6fbff)';
  }
}

// 🧥 Clothing suggestion
function getClothingAdvice(temp) {
  if (isCelsius) {
    if (temp <= 5) return "🧥 Wear a heavy coat and gloves!";
    if (temp <= 15) return "🧣 Wear a jacket or sweater.";
    if (temp <= 25) return "👕 T-shirt weather.";
    return "☀️ Stay cool with light clothes!";
  } else {
    if (temp <= 41) return "🧥 Wear a heavy coat and gloves!";
    if (temp <= 59) return "🧣 Wear a jacket or sweater.";
    if (temp <= 77) return "👕 T-shirt weather.";
    return "☀️ Stay cool with light clothes!";
  }
}
