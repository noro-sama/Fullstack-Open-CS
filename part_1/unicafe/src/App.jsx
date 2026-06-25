import { useState } from "react";

const Button = ({ text, onClick }) => (
  <>
    {" "}
    <button onClick={onClick}>{text}</button>
  </>
);

const Rating = ({ text, votes }) => {
  return (
    <p>
      {text} {votes}
    </p>
  );
};

function App() {
  const [clicks, setClicks] = useState(0);

  const onClick = () => {
    console.log("hi");
    setClicks(1);
    console.log(clicks);
  };

  return (
    <>
      <h1>Give Feedback</h1>
      <Button text="good" onClick={onClick} />
      <Button text="neutral" onClick={onClick} />
      <Button text="bad" onClick={onClick} />
      <h2>Satistics</h2>
      <Rating text="good" votes={0} />
      <Rating text="good" votes={6} />
      <Rating text="good" votes={9} />
    </>
  );
}

export default App;
