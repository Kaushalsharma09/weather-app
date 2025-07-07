// Load settings on page load
document.addEventListener("DOMContentLoaded", () => {
  // Load language setting
  const lang = localStorage.getItem("lang") || "en";
  document.getElementById("settingsLanguage").value = lang;

  // Load unit system
  const unit = localStorage.getItem("unit") || "metric";
  document.getElementById("settingsUnit").value = unit;

  // Load dark mode
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "on") {
    document.body.classList.add("dark");
  }

  // Load alert setting
  const alertsOn = localStorage.getItem("alerts") === "on";
  document.getElementById("alertToggle").checked = alertsOn;

  // Load and render favorites
  renderSettingsFavorites();
});

// 🌐 Update any setting
function updateSetting(key, value) {
  localStorage.setItem(key, value);
  alert(`Updated ${key} to ${value}`);
}

// 🌓 Toggle dark mode (updates localStorage too)
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark ? "on" : "off");
  alert("Dark mode " + (isDark ? "enabled" : "disabled"));
}

// ⚠️ Alert toggle
function toggleAlertSetting() {
  const isOn = document.getElementById("alertToggle").checked;
  localStorage.setItem("alerts", isOn ? "on" : "off");
  alert("Weather alerts " + (isOn ? "enabled" : "disabled"));
}

// ⭐ Render favorite cities (for delete only)
function renderSettingsFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const list = document.getElementById("settingsFavoritesList");
  list.innerHTML = "";

  if (!favorites.length) {
    list.innerHTML = "<li>No favorites saved.</li>";
    return;
  }

  favorites.forEach(city => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${city}
      <button onclick="removeFavorite('${city}')">Remove ❌</button>
    `;
    list.appendChild(li);
  });
}

// 🗑️ Remove favorite from localStorage
function removeFavorite(city) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter(c => c !== city);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderSettingsFavorites();
}
