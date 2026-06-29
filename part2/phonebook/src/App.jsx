import { useState } from "react";
import { PhoneForm, Numbers, Filter } from "./components/phone.";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (newName === "" || newNumber === "") {
      alert("please fill in all the fields");
      return;
    }

    let isDuplicateName = false;
    let isDuplicateNumber = false;

    persons.forEach((person) => {
      if (person.name === newName) {
        isDuplicateName = true;
      } else if (person.number === newNumber) {
        isDuplicateNumber = true;
      }
    });

    if (isDuplicateName) {
      alert(`${newName} is already added to phonebook`);
    } else if (isDuplicateNumber) {
      alert(`${newNumber} is already added to phonebook`);
    } else {
      setPersons((prev) => {
        const arr = [...prev];
        arr.push({ name: newName, number: newNumber });
        return arr;
      });
    }
  };
  console.log(persons);
  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleSearch = (e) => {
    if (e.target.value !== "") {
      setIsSearching(true);
      setQuery(e.target.value);
    } else {
      setIsSearching(false);
    }
  };

  const personsToShow = isSearching
    ? persons.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter onChange={handleSearch} />
      <PhoneForm
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onSubmit={handleFormSubmit}
      />
      <h2>Numbers</h2>
      <Numbers phonebook={personsToShow} />
    </div>
  );
};

export default App;
