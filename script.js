'use strict';

const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timeZone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const API_KEY = '37ac969a76b61afa1e550e5e83883a6f';

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minute = time.getMinutes();
  const ampm = hour >= 12 ? 'PM' : 'AM';

  timeEl.innerHTML = `${
    hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat
  }:${
    minute < 10 ? '0' + minute : minute
  } <span id="am-pm">${ampm}</span></div>`;

  dateEl.innerHTML = `${days[day]}, ${date} ${months[month]}`;
}, 1000);

const getWeatherData = function () {
  navigator.geolocation.getCurrentPosition((success) => {
    const { latitude, longitude } = success.coords;

    const APICall = (async function () {
      const result = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&units=metric&appid=${API_KEY}`
      );
      const data = await result.json();
      console.log(data);

      let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

      timeZone.innerHTML = data.timezone;
      countryEl.innerHTML = `${
        data.lat > 0 ? data.lat + 'N' : data.lat + 'W'
      } ${data.lon > 0 ? data.lon + 'E' : data.lon + 'W'}`;

      const html = ` 
      <div class="weather-items">
       <div>Humidity</div> 
       <div>${humidity}%</div> 
      </div> 
      <div class="weather-items">
       <div>Pressure</div>
       <div>${pressure} hPa</div>
      </div>
      <div class="weather-items">
       <div>Wind Speed</div>
       <div>${wind_speed} m/sec</div>
      </div>
      <div class="weather-items">
       <div>Sunrise</div>
       <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
      </div><div class="weather-items">
      <div>Sunset</div>
      <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
     </div>`;

      currentWeatherItemsEl.insertAdjacentHTML('afterbegin', html);

      let otherDayForecast = ``;

      data.daily.forEach((day, i) => {
        if (i === 0) {
          currentTempEl.innerHTML = `
          <div class="today" id="current-temp">
          <img
            src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png"
            alt="weather-icon"
            class="w-icon"
          />
          <div class="others">
            <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
            <div class="temp">Night - ${day.temp.night} &#176;C</div>
            <div class="temp">Day - ${day.temp.day} &#176;C</div>
          </div>
        </div>
        `;
        } else {
          otherDayForecast += `
          <div class="weather-forecast-item">
          <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
          <img
            src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
            alt="weather-icon"
            class="w-icon"
          />
          <div class="temp">Night - ${day.temp.night} &#176;C</div>
          <div class="temp">Day - ${day.temp.day} &#176;C</div>
        </div>
            `;
        }
      });
      weatherForecastEl.innerHTML = otherDayForecast;
    })();
  });
};

getWeatherData();
