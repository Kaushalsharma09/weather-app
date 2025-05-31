// Global state
let isCelsius = true;
let currentLang = "en";

// 🌐 Language setting
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  getWeather(); // reload data
}

// 🌡️ Unit toggle
function toggleTempUnit() {
  isCelsius = !isCelsius;
  document.getElementById("unitToggle").innerText = isCelsius ? "°C" : "°F";
  localStorage.setItem("unit", isCelsius ? "metric" : "imperial");
  getWeather(); // reload with new units
}

// 🌗 Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", dark ? "on" : "off");
}

// 🎤 Voice input
function startVoiceInput() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Your browser does not support voice input.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = currentLang;
  recognition.interimResults = false;
  recognition.start();

  recognition.onresult = function(event) {
    const city = event.results[0][0].transcript;
    document.getElementById("cityInput").value = city;
    getWeather();
  };
}

// 📍 Get location weather
function getLocationWeather() {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    getWeatherByCoords(latitude, longitude);
  }, () => alert("Unable to access location."));
}

// 🕒 Local time updater
function updateLocalTime(offsetSeconds) {
  const timeEl = document.getElementById("localTime");
  setInterval(() => {
    const utc = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    const local = new Date(utc + offsetSeconds * 1000);
    timeEl.textContent = "Local time: " + local.toLocaleTimeString();
  }, 1000);
}

// 🧭 Wind direction compass
function drawCompass(degree) {
  const canvas = document.getElementById("windCompass");
  const ctx = canvas.getContext("2d");
  const center = canvas.width / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw compass base
  ctx.beginPath();
  ctx.arc(center, center, 50, 0, 2 * Math.PI);
  ctx.stroke();

  // Draw needle
  ctx.beginPath();
  ctx.moveTo(center, center);
  const angle = (degree - 90) * Math.PI / 180;
  ctx.lineTo(center + 40 * Math.cos(angle), center + 40 * Math.sin(angle));
  ctx.strokeStyle = "#0077be";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Label
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("N", center, center - 60);
}

// ⭐ Favorite cities
function addFavorite() {
  const city = document.getElementById("favoriteInput").value.trim();
  if (!city) return;
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
    document.getElementById("favoriteInput").value = "";
  }
}

function deleteFavorite(city) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter(c => c !== city);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
}

function renderFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const list = document.getElementById("favoritesList");
  list.innerHTML = "";
  favorites.forEach(city => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${city}
      <button onclick="getWeather('${city}')">🌤</button>
      <button onclick="deleteFavorite('${city}')">❌</button>
    `;
    list.appendChild(li);
  });
}

// 🛠️ Init app settings
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "en";
  const savedUnit = localStorage.getItem("unit") || "metric";
  const dark = localStorage.getItem("darkMode") === "on";

  currentLang = savedLang;
  document.getElementById("languageSelect").value = savedLang;

  isCelsius = savedUnit === "metric";
  document.getElementById("unitToggle").innerText = isCelsius ? "°C" : "°F";

  if (dark) document.body.classList.add("dark");

  renderFavorites();
});
