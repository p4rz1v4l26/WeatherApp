import React, { useState, useEffect } from "react";
import "../../assets/css/Home_loggerIn.css";
import Navbar from "../UI/Navbar.jsx";

const Home_loggedIn = (props) => {
  const [location, setLocation] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [city_name, setCity_name] = useState(null);

  function convertUnixTimestampToGeneralForm(unixTimestamp) {
    // Convert Unix timestamp to milliseconds
    const milliseconds = unixTimestamp * 1000;

    // Create a Date object
    const date = new Date(milliseconds);

    // Format the Date object into a general time format
    const options = { hour: "numeric", minute: "numeric", second: "numeric" };
    return date.toLocaleTimeString("en-IN", options);
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      });
    }
  }, []);

  const fetchWeatherData = async (latitude, longitude) => {
    const apiKey = "7f31f8bdae6b48d9a29222d1606df16b";
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setCurrentWeather(data.data[0]);
        setForecast(data.data.slice(1, 6));
        setCity_name(data.city_name);
      } else {
        console.error("Failed to fetch weather data");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleLocationChange = async () => {
    if (!location.trim()) return;

    const apiKey = "7f31f8bdae6b48d9a29222d1606df16b";
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${location}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setCurrentWeather(data.data[0]);
        setForecast(data.data.slice(1, 6));
        setCity_name(data.city_name);
      } else {
        console.error("Failed to fetch weather data");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <div className="rootDiv" align="center">
      <Navbar
        isUserLoggedIn={props.isUserLoggedIn}
        navigate={props.navigate}
        handleLogout={props.handleLogout}
      />
        <div className="searchBar">
            <div>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location"
                    />
                <button type="submit" onClick={handleLocationChange}>
                    Search
                </button>
            </div>
            {!currentWeather && !forecast && <div className="spinner"></div>}
        </div>

      {currentWeather && (
        <>
          <br />
          <br />
          <div className="outerContainer">
                <h2>Current Weather in {city_name}</h2>
                <div className="container">
                    <div class="box">
                    <div class="title">Temperature</div>
                    <p> <span className="tempSpan"> {currentWeather.temp}°C </span></p>
                    <p> <span className="dataSpan">Max Temp  {currentWeather.max_temp}°C </span></p>
                    <p> <span className="dataSpan">Min Temp {currentWeather.min_temp}°C </span></p>
                    </div>
                    <div class="box">
                    <div class="title">Description</div>
                    <p> <span className="dataSpan"> {currentWeather.weather.description} </span></p>
                    <p> <span className="dataSpan">Sunrise at {convertUnixTimestampToGeneralForm(currentWeather.sunrise_ts)} </span></p>
                    <p> <span className="dataSpan">Sunset at {convertUnixTimestampToGeneralForm(currentWeather.sunset_ts)} </span></p>
                    </div>
                </div>
          </div>
        </>
      )}
      {forecast && (
        <div style={{ textAlign: "center" }}>
          <h1>5-Day Forecast</h1>
          <br />
          <table className="center-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Min Temp</th>
                <th>Max Temp</th>
                <th>Description</th>
                <th>Sunrise (GMT 5:30+)</th>
                <th>Sunset (GMT 5:30+)</th>
              </tr>
            </thead>
            <tbody>
              {forecast.map((day) => (
                <tr key={day.valid_date}>
                  <td>{day.valid_date}</td>
                  <td>{day.min_temp}°C</td>
                  <td>{day.max_temp}°C</td>
                  <td>{day.weather.description}</td>
                  <td>{convertUnixTimestampToGeneralForm(day.sunrise_ts)}</td>
                  <td>{convertUnixTimestampToGeneralForm(day.sunset_ts)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home_loggedIn;
