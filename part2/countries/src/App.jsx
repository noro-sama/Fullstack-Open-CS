import { useState, useEffect } from "react";
import countriesService from "./services/countries.js";
import { ResultsContainer } from "./components/ResultsDrawer.jsx";
import { CountryPage, SearchInput } from "./components/Country.jsx";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState([]);
  const [results, setResults] = useState(null);
  const [errorText, setErrorText] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    countriesService
      .getAll()
      .then((response) => {
        console.log(response);
        setCountries(response);
      })
      .catch((error) => {
        setErrorText("failed to fetch countries");
        setTimeout(() => {
          setErrorText(null);
        }, 5000);
        console.error("Something went wrong", error);
      });
  }, []);

  const handleSearch = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    console.log(newQuery);
    if (countries) {
      const searchResults = countries.filter((c) => {
        const cName = c.name.common;
        return cName.toLowerCase().includes(newQuery.toLowerCase());
      });
      setResults(searchResults);
      console.log(searchResults);
    }
  };

  const handleshowDetails = (country) => {
    setSelectedCountry(country);
  };

  const handleBack = () => {
    setSelectedCountry(null);
  };

  return (
    <>
      <div>
        <header>
          <h1>Countries App</h1>
          <p>Search for a country and find out the weather in its capital</p>
        </header>
        <span>{errorText}</span>
        <SearchInput onChange={handleSearch} />
        {selectedCountry ? (
          <div>
            <button onClick={handleBack}>go back</button>
            <CountryPage country={selectedCountry} />{" "}
          </div>
        ) : (
          <ResultsContainer
            results={results}
            handleShowDetails={handleshowDetails}
          />
        )}
      </div>
    </>
  );
}

export default App;
