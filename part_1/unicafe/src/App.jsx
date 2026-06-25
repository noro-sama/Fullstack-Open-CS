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
    console.log("before", good);
    setGood((prev) => prev + 1);
  };

  const handleClickNeutral = () => {
    console.log("before,", neutral);
    setNeutral((prev) => prev + 1);
  };

  const handleClickBad = () => {
    console.log("before,", bad);
    setBad((prev) => prev + 1);
  };

  const total = good + bad + neutral;
  const average = total / 3;
  const positive = good > 0 ? (good / total) * 100 : 0;
  console.log(total, average, positive);
  console.log(good, bad, neutral);
  const statistics = { avg: average, percent: positive, votes: total };
  console.log(statistics);
  return (
    <>
      <h1>Give Feedback</h1>
      <Button text="good" onClick={handleClickGood} />
      <Button text="neutral" onClick={handleClickNeutral} />
      <Button text="bad" onClick={handleClickBad} />
      <h2>Statistics</h2>
      {total === 0 ? "No feedback given" : <Statistics stats={statistics} />}
    </>
  );
}

export default App;
