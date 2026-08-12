import React, { useState } from "react";
import axios from "axios";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Get API key from .env file
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
 

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${API_KEY}&units=metric`;

      const response = await axios.get(API_URL);

      setWeather(response.data);
    } catch (err) {
      console.log("API Error:", err);
      console.log("Status:", err.response?.status);
      console.log("Data:", err.response?.data);

      setWeather(null);

      if (err.response?.status === 404) {
        setError("City not found. Please enter a valid city name.");
      } else if (err.response?.status === 401) {
        setError("Invalid API key. Please check your OpenWeatherMap API key.");
      } else {
        setError("Unable to fetch weather data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    getWeather();
  };

  return (
    <section className="weather-section">
      <div className="weather-container">

        <header className="weather-header">
          <h1>Weather Report</h1>
          <p>Search for the current weather in any city</p>
        </header>

        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Enter city name"
            aria-label="City name"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {weather && (
          <article className="weather-card">

            <div className="weather-location">
              <h2>
                {weather.name}, {weather.sys.country}
              </h2>

              <p>
                {new Date(weather.dt * 1000).toLocaleDateString()}
              </p>
            </div>

            <div className="weather-main">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />

              <div>
                <p className="temperature">
                  {Math.round(weather.main.temp)}°C
                </p>

                <p className="description">
                  {weather.weather[0].description}
                </p>
              </div>
            </div>

            <div className="weather-details">

              <div className="weather-item">
                <span>Feels Like</span>
                <strong>
                  {Math.round(weather.main.feels_like)}°C
                </strong>
              </div>

              <div className="weather-item">
                <span>Humidity</span>
                <strong>
                  {weather.main.humidity}%
                </strong>
              </div>

              <div className="weather-item">
                <span>Wind Speed</span>
                <strong>
                  {weather.wind.speed} m/s
                </strong>
              </div>

              <div className="weather-item">
                <span>Pressure</span>
                <strong>
                  {weather.main.pressure} hPa
                </strong>
              </div>

            </div>
          </article>
        )}

      </div>
    </section>
  );
};

export default Weather;