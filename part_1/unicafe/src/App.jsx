import { useState } from "react";

const Button = ({ text, onClick }) => (
  <>
    <button onClick={onClick}>{text}</button>
  </>
);

const StatisticsLine = ({ text, val }) => {
  return (
    <>
      <p>
        {text} {val}
      </p>
    </>
  );
};

const Statistics = ({ stats }) => {
  return (
    <>
      <StatisticsLine text="average" val={stats.avg} />
      <StatisticsLine text="positive" val={stats.percent} />
      <StatisticsLine text="total" val={stats.votes} />
    </>
  );
};

function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleClickGood = () => {
    setGood((prev) => prev + 1);
  };

  const handleClickNeutral = () => {
    setNeutral((prev) => prev + 1);
  };

  const handleClickBad = () => {
    setBad((prev) => prev + 1);
  };

  const total = good + bad + neutral;
  const average = total / 3;
  const positive = good > 0 ? (good / total) * 100 : 0;

  return (
    <>
      <h1>Give Feedback</h1>
      <Button text="good" onClick={handleClickGood} />
      <Button text="neutral" onClick={handleClickNeutral} />
      <Button text="bad" onClick={handleClickBad} />
      <h2>Statistics</h2>
      {total === 0 ? (
        <p>No feedback given</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>good</td>
              <td>{good}</td>
            </tr>
            <tr>
              <td>neutral</td>
              <td>{neutral}</td>
            </tr>
            <tr>
              <td>bad</td>
              <td>{bad}</td>
            </tr>
            <tr>
              <td>all</td>
              <td>{total}</td>
            </tr>
            <tr>
              <td>avrage</td>
              <td>{average}</td>
            </tr>
            <tr>
              <td>positive</td>
              <td>{positive}%</td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
}

export default App;
