const apiKey = "6576fdfa927f4313b869ec308823ea76"; // Replace with your OpenWeatherMap API key

async function getForecast() {
  const city = document.getElementById("forecastCityInput").value.trim();
  if (!city) return;

  const unit = isCelsius ? "metric" : "imperial";
  const lang = currentLang;

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${unit}&lang=${lang}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found.");
    const data = await response.json();
    renderForecast(data);
  } catch (error) {
    document.getElementById("forecastCards").innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

// 📊 Render forecast cards + chart
function renderForecast(data) {
  const forecastEl = document.getElementById("forecastCards");
  const chartEl = document.getElementById("forecastChart");
  const summaryEl = document.getElementById("forecastSummary");
  forecastEl.innerHTML = "";
  summaryEl.innerHTML = "";

  const grouped = {};
  const temps = [], labels = [];

  data.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(item);
  });

  // Render 5 day cards
  const days = Object.keys(grouped).slice(0, 5);
  days.forEach(date => {
    const dayData = grouped[date][0]; // First entry of the day
    const icon = dayData.weather[0].icon;
    const temp = dayData.main.temp;
    const desc = dayData.weather[0].description;

    temps.push(temp);
    labels.push(new Date(date).toLocaleDateString(undefined, { weekday: 'short' }));

    forecastEl.innerHTML += `
      <div class="forecast-day">
        <h4>${new Date(date).toDateString()}</h4>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" />
        <p>${temp}°${isCelsius ? "C" : "F"}</p>
        <p>${desc}</p>
      </div>`;
  });

  renderForecastChart(labels, temps);
  generateForecastSummary(temps, days);
}

// 📈 Render Chart.js Line Chart
function renderForecastChart(labels, temps) {
  new Chart(document.getElementById("forecastChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: `Daily Avg Temp (°${isCelsius ? "C" : "F"})`,
        data: temps,
        fill: false,
        borderColor: "#0077be",
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

// 🧠 Simple AI-style summary
function generateForecastSummary(temps, days) {
  const summaryEl = document.getElementById("forecastSummary");
  const avg = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
  let message = "";

  if (avg <= (isCelsius ? 5 : 41)) {
    message = "Expect cold days ahead. Bundle up!";
  } else if (avg <= (isCelsius ? 15 : 59)) {
    message = "Mild weather incoming — keep a jacket handy.";
  } else if (avg <= (isCelsius ? 25 : 77)) {
    message = "Pleasant weather for outdoor plans!";
  } else {
    message = "Hot days ahead! Stay hydrated and cool.";
  }

  summaryEl.innerHTML = `
    <h3>Forecast Summary</h3>
    <p>Average temperature: ${avg}°${isCelsius ? "C" : "F"}</p>
    <p>${message}</p>
  `;
}
