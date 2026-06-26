import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];
  const arr = Array(anecdotes.length).fill(0);
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(arr);
  const handeClick = () => {
    setSelected(Math.floor(Math.random() * 7) + 1);
  };

  const handleVoteClick = () => {
    setVotes((prev) => {
      const newVotes = [...prev];
      newVotes[selected] += 1;
      return newVotes;
    });
  };

  let maxIndex = 0;
  let maxVotes = 0;
  for (let i = 1; i < votes.length; i++) {
    if (votes[i] > maxVotes) {
      maxVotes = votes[i];
      maxIndex = i;
    }
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <div style={{ display: "inline" }}>
        <button onClick={handleVoteClick}>vote</button>
        <button onClick={handeClick}>next anecdote</button>
      </div>

      <h2>Anecdote with the most votes</h2>
      <p>
        {anecdotes[maxIndex]} has {votes[maxIndex]} votes
      </p>
    </div>
  );
};

export default App;
