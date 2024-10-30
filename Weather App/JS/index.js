const myApiKey = `e8869cf80333448195c32113240107`;
const baseUrl = `https://api.weatherapi.com/v1/forecast.json`; // Changed to https
let searchLocation = document.querySelector("#findLocation");

searchLocation.addEventListener("change", function () {
  getWeather(searchLocation.value);
});

searchLocation.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    getWeather(searchLocation.value);
  }
});

async function getWeather(myPosition) {
  try {
    let response = await fetch(`${baseUrl}?key=${myApiKey}&q=${myPosition}&days=3`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let finalResponse = await response.json();
    console.log(finalResponse);
    displayWeatherData(finalResponse);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please enter a valid location",
    });
    searchLocation.value = "";
    document.querySelector("#myData").innerHTML = "";
  }
}

function displayWeatherData(data) {
  try {
    let dataArray = data.forecast.forecastday;
    console.log(dataArray);
    let weatherBox = ``;
    for (let i = 0; i < dataArray.length; i++) {
      const date = new Date(dataArray[i].date);
      const weekday = date.toLocaleDateString("en-us", { weekday: "long" });
      const month = date.toLocaleDateString("en-us", { month: "long" });
      const dayNum = date.toLocaleDateString("en-us", { day: "numeric" });

      const cityName = i === 0 ? `<h5 class="card-title display-4 fw-bolder city-name">${data.location.name}</h5>` : ``;

      let windStatus = '';
      if (i === 0) {
        windStatus = `
          <span><img src="images/icon-umberella.png" alt="" class="umbrella-icon">${dataArray[i].day.daily_chance_of_rain}%</span>
          <span><img src="images/icon-wind.png" alt="" class="wind-icon">${dataArray[i].day.maxwind_kph} km/h</span>
          <span><img src="images/icon-compass.png" alt="" class="compass-icon">east</span>
        `;
      }
      

      weatherBox += `<div class="col-lg-4 col-md-6 col-sm-12 mb-4">
        <div class="card">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5>${weekday}</h5>
            <span>${dayNum} ${month}</span>
          </div>
          <div class="card-body py-5 text-center">
            ${cityName}
            <p class="card-text temp fw-bolder fs-2">${data.current.temp_c}°C</p>
            <img width="50px" src="https:${dataArray[i].day.condition.icon}" class="m-auto d-block " alt="${dataArray[i].day.condition.text}">
            <p class="status text-info">${dataArray[i].day.condition.text}</p>
            <div class="wind-status d-flex align-items-center justify-content-between">
              ${windStatus}
            </div>
          </div>
        </div>
      </div>`;
    }
    document.querySelector("#myData").innerHTML = weatherBox;
  } catch (error) {
    console.error('Error displaying weather data:', error);
  }
}

function myCurrentLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let myCurrentPosition = `${latitude},${longitude}`;
  console.log(position);
  getWeather(myCurrentPosition);
}

navigator.geolocation.getCurrentPosition(myCurrentLocation);
