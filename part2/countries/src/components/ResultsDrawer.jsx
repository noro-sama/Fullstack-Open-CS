import { CountryPage } from "./Country";

export const ResultsContainer = ({ results, handleShowDetails }) => {
  const renderContent = () => {
    if (!results) {
      return null;
    }
    if (results.length === 1) {
      return <CountryPage country={results[0]} />;
    }
    if (results.length < 11) {
      return (
        <>
          <div className="results">
            {results.map((item) => (
              <div className="match" key={item.area}>
                <p>{item.name.common}</p>
                <button
                  onClick={() => {
                    handleShowDetails(item);
                  }}
                >
                  show
                </button>
              </div>
            ))}
          </div>
        </>
      );
    }
    return <p>too many matches, specify another filter</p>;
  };
  return <div>{renderContent()}</div>;
};
