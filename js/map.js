const apiKey = "6576fdfa927f4313b869ec308823ea76"; 
const googleMapsApiKey = "KVzs3OpR9unm3taAbkkarXxxFfe0tFga";

// 🔍 Load map and webcam from city name
async function loadMap() {
  const city = document.getElementById("mapCityInput").value.trim();
  if (!city) return;

  try {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
    const res = await fetch(geoUrl);
    const data = await res.json();
    if (!data.length) throw new Error("City not found.");

    const { lat, lon } = data[0];
    showGoogleMap(lat, lon);
    loadWebcam(lat, lon);
  } catch (err) {
    alert("Map load failed: " + err.message);
  }
}

// 🗺️ Show city on Google Map
function showGoogleMap(lat, lon) {
  const mapFrame = document.getElementById("googleMap");
  const zoom = 10;
  const mapURL = `https://www.google.com/maps/embed/v1/view?key=${googleMapsApiKey}&center=${lat},${lon}&zoom=${zoom}&maptype=roadmap`;
  mapFrame.src = mapURL;
}

// 📷 Load webcam near coordinates (via Windy.com)
function loadWebcam(lat, lon) {
  const webcamContainer = document.getElementById("webcamContainer");
  webcamContainer.innerHTML = `
    <iframe 
      width="100%" 
      height="300" 
      frameborder="0" 
      allowfullscreen 
      src="https://webcams.windy.com/webcams/public/embed.html?lat=${lat}&lon=${lon}&zoom=7">
    </iframe>
    <p style="font-size: 14px;">Source: <a href="https://windy.com/webcams" target="_blank">Windy Webcams</a></p>
  `;
}
