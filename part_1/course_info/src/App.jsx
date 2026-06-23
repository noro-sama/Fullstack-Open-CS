const Header = ({ course }) => {
  return (
    <>
      <h1>Course: {course}</h1>
    </>
  );
};

const Part = ({ part, exercise }) => {
  return (
    <>
      <p>
        {part} {exercise}
      </p>
    </>
  );
};

const Content = ({ props }) => {
  return (
    <>
      <Part part={props[0].part1} exercise={props[0].exercises1} />

      <Part part={props[1].part2} exercise={props[1].exercises2} />
      <Part part={props[2].part3} exercise={props[2].exercises3} />
    </>
  );
};

const Total = ({ totalNum }) => {
  return (
    <>
      <p>Number of exercises {totalNum}</p>
    </>
  );
};

const App = () => {
  const course = "Half Stack application development";
  const arr = [
    {
      part1: "Fundamentals of React",
      exercises1: 10,
    },
    { part2: "Using props to pass data", exercises2: 7 },
    { part3: "State of a component", exercises3: 14 },
  ];

  return (
    <div>
      <Header course={course} />
      <Content props={arr} />
      <Total
        totalNum={arr[0].exercises1 + arr[1].exercises2 + arr[2].exercises3}
      />
    </div>
  );
};

export default App;
