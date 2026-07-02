import { useState, useEffect } from "react";
import { getWeather } from "../services/countries";

export const CountryPage = ({ country }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    // if (!country || !country.capital) {
    //   setWeatherData(null);
    // }
    getWeather(country.capital)
      .then((res) => {
        setWeatherData(res);
        console.log(res);
        console.log(res.weather[0]);
      })
      .catch((error) => {
        console.error("Something went wrong", error);
      });
  }, [country]);
  // const iconCode = weatherData.weather[0].icon;

  const languagesList = country.languages
    ? Object.values(country.languages)
    : [];
  return (
    <div className="country-details">
      <h1>{country.name.common}</h1>
      <article>
        <div>
          <p>Capital: {country.capital[0]}</p>
          <p>Area: {country.area}</p>
          <h2>Languages</h2>
          <ul>
            {languagesList.map((lang) => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>
        </div>
        <img src={country.flags.png} alt={country.flags.alt} />
      </article>
      {weatherData && (
        <div className="weather">
          <h1>Weather in {weatherData.name}</h1>
          <div className="details">
            <p> Temperature {Math.round(weatherData.main.temp)}°C</p>
            <p>{weatherData.weather[0].description}</p>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt="weather icon"
              className="d-icon"
              width="30"
            />
            <p>Wind {weatherData.wind.speed}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const SearchInput = ({ onChange }) => (
  <div className="search">
    <label>find countries</label>
    <input onChange={onChange} />
  </div>
);
