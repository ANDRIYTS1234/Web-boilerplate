// metaweather.com is no longer available, so Open-Meteo is used (free, no API key).
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REVERSE_GEOCODE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

export const KYIV = { latitude: 50.4501, longitude: 30.5234, name: 'Kyiv' };

const WEATHER_CODES = {
  0: { text: 'Clear', icon: '☀️' },
  1: { text: 'Mainly clear', icon: '🌤️' },
  2: { text: 'Partly cloudy', icon: '⛅' },
  3: { text: 'Overcast', icon: '☁️' },
  45: { text: 'Fog', icon: '🌫️' },
  48: { text: 'Fog', icon: '🌫️' },
  51: { text: 'Light drizzle', icon: '🌦️' },
  53: { text: 'Drizzle', icon: '🌦️' },
  55: { text: 'Heavy drizzle', icon: '🌧️' },
  61: { text: 'Light rain', icon: '🌦️' },
  63: { text: 'Rain', icon: '🌧️' },
  65: { text: 'Heavy rain', icon: '🌧️' },
  66: { text: 'Freezing rain', icon: '🌧️' },
  67: { text: 'Freezing rain', icon: '🌧️' },
  71: { text: 'Light snow', icon: '🌨️' },
  73: { text: 'Snow', icon: '🌨️' },
  75: { text: 'Heavy snow', icon: '❄️' },
  77: { text: 'Snow grains', icon: '❄️' },
  80: { text: 'Showers', icon: '🌦️' },
  81: { text: 'Showers', icon: '🌧️' },
  82: { text: 'Heavy showers', icon: '⛈️' },
  85: { text: 'Snow showers', icon: '🌨️' },
  86: { text: 'Snow showers', icon: '🌨️' },
  95: { text: 'Thunderstorm', icon: '⛈️' },
  96: { text: 'Thunderstorm', icon: '⛈️' },
  99: { text: 'Thunderstorm', icon: '⛈️' },
};

const checkResponse = (response) => {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
};

export const fetchForecast = async ({ latitude, longitude }, days = 5) => {
  const params = new URLSearchParams({
    latitude,
    longitude,
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: days,
  });

  const { daily } = await fetch(`${FORECAST_URL}?${params}`).then(checkResponse);

  return daily.time.map((date, index) => ({
    date,
    maxTemp: Math.round(daily.temperature_2m_max[index]),
    minTemp: Math.round(daily.temperature_2m_min[index]),
    wind: Math.round(daily.wind_speed_10m_max[index]),
    precipitation: daily.precipitation_probability_max[index],
    ...(WEATHER_CODES[daily.weather_code[index]] || { text: 'Unknown', icon: '❔' }),
  }));
};

export const fetchCityName = async ({ latitude, longitude }) => {
  const params = new URLSearchParams({ latitude, longitude, localityLanguage: 'en' });
  const data = await fetch(`${REVERSE_GEOCODE_URL}?${params}`).then(checkResponse);
  return data.city || data.locality || 'Your location';
};

export const getCurrentPosition = () => new Promise((resolve, reject) => {
  if (!navigator.geolocation) {
    reject(new Error('Geolocation is not supported'));
    return;
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
    reject,
    { timeout: 8000 },
  );
});
