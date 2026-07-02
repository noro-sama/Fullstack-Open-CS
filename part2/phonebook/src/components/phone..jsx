export const Filter = ({ onChange }) => (
  <div>
    filter shown with <input onChange={onChange} />
  </div>
);

export const PhoneForm = ({ onSubmit, onNameChange, onNumberChange }) => (
  <form
    style={{
      padding: "10px",
      display: "flex",
      flexDirection: "column",
      gap: "0.345em",
    }}
    onSubmit={onSubmit}
  >
    <div>
      name: <input type="text" onChange={onNameChange} />
    </div>
    <div>
      number: <input onChange={onNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

export const Person = ({ details, onClick }) => (
  <>
    <li>
      {details.name} {details.number} <button onClick={onClick}>delete</button>
    </li>
  </>
);
