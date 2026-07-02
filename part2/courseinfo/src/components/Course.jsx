const Header = (props) => <h1>{props.course}</h1>;

const Content = (props) => {
  return (
    <div>
      {props.parts.map((part) => (
        <Part name={part.name} exercises={part.exercises} key={part.id} />
      ))}
    </div>
  );
};

const Part = ({ name, exercises }) => (
  <p>
    {name} {exercises}
  </p>
);

const Total = ({ total }) => <p>Number of exercises {total}</p>;

const Course = ({ course }) => {
  const GetTotal = course.parts.reduce((sum, item) => {
    const newSum = sum + item.exercises;
    return newSum;
  }, 0);

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={GetTotal} />
    </div>
  );
};

export default Course;
