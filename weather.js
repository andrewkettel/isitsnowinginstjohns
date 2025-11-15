// Constants
const API_URL = "https://api.weather.gov/gridpoints/PQR/110,107/forecast";
const SNOW_WORDS = ["Snow", "Light Snow", "Rain And Snow"];

$(document).ready(function () {
  // Show loading GIF when AJAX request starts
  $.ajaxSetup({
    beforeSend: function () {
      $('#loading').show();
    },
    complete: function () {
      $('#loading').hide();
    }
  });

  $.ajax({
    dataType: 'json',
    url: API_URL,
    success: function (data) {
      updateWeather(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      handleError(errorThrown);
    }
  });
});

function updateWeather(data) {
  const weather = data.properties.periods[0].shortForecast;
  const isSnowing = SNOW_WORDS.some(word => weather.toLowerCase().includes(word.toLowerCase()));

  if (isSnowing) {
    $('#yes').show();
    $('#no').hide();
    $('body').removeClass('green').addClass('red');
  } else {
    $('#yes').hide();
    $('#no').show();
    $('body').removeClass('red').addClass('green');
  }

  // Populate weekly forecast
  const periods = data.properties.periods;
  let forecastHTML = '';

  for (let i = 0; i < Math.min(periods.length, 14); i++) {
    const period = periods[i];
    const hasSnow = SNOW_WORDS.some(word => period.shortForecast.toLowerCase().includes(word.toLowerCase()));
    const snowIndicator = hasSnow ? '❄️ ' : '';

    forecastHTML += `
      <div class="forecast-item">
        <div class="forecast-header">
          <img src="${period.icon}" alt="${period.shortForecast}" class="forecast-icon">
          <h3>${snowIndicator}${period.name}</h3>
        </div>
        <p class="temperature">${period.temperature}°${period.temperatureUnit}</p>
        <p class="short-forecast">${period.shortForecast}</p>
        <p class="detailed-forecast">${period.detailedForecast}</p>
        <p class="wind">Wind: ${period.windSpeed} ${period.windDirection}</p>
      </div>
    `;
  }

  $('#forecastContent').html(forecastHTML);
}

function handleError(error) {
  console.error("Error fetching weather data:", error);
  $('#currentForecast').text("Failed to load weather information. Please try again later.");
  $('body').addClass('green');
}