import { useState, useEffect } from "react";
import { PhoneForm, Person, Filter } from "./components/phone.";
import personsService from "./services/persons.js";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    personsService.getAll("http://localhost:3001/persons").then((response) => {
      console.log("promise fulfilled");
      setPersons(response);
    });
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (newName.trim() === "" || newNumber.trim() === "") {
      alert("please fill in all the fields");
      return;
    }

    const nameExists = persons.find((person) => person.name === newName);

    const numberExists = persons.find((person) => person.number === newNumber);

    if (nameExists && !numberExists) {
      const userConfirmed = window.confirm(
        `${nameExists.name} is already added  to the phonebook. Replace old number with new one? This cannot be undone.`,
      );
      if (userConfirmed) {
        personsService
          .updateNumber(nameExists.id, {
            name: nameExists.name,
            number: newNumber,
          })
          .then((returnedContact) => {
            setPersons(
              persons.map((contact) =>
                contact.id !== returnedContact.id ? contact : returnedContact,
              ),
            );
          })
          .catch((err) => {
            console.error("Failed to Update contact", err);
          });
      } else {
        console.log("Contact update canceled by user.");
      }
    } else {
      personsService
        .create({ name: newName, number: newNumber })
        .then((data) => setPersons(persons.concat(data)))
        .catch((err) => {
          console.error("Failed to create contact:", err);
        })
        .finally(() => {
          setNewName("");
          setNewNumber("");
        });
    }
  };
  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleDelete = (id) => {
    const person = personsToShow?.find((person) => person.id === id);
    const userConfirmed = window.confirm(
      `Are you sure you want to delete contact ${person.name}? This cannot be undone.`,
    );

    if (userConfirmed) {
      personsService
        .deleteItem(person.id)
        .then(() => {
          personsService.getAll().then((updatedPersons) => {
            setPersons(updatedPersons);
          });
        })
        .catch((err) => {
          console.error("Failed to Delete contact", err);
        });
    } else {
      console.log("Deletion canceled by user.");
    }
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
      <h2>Add a new Contact</h2>
      <PhoneForm
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onSubmit={handleFormSubmit}
      />
      <h2>Numbers</h2>

      {isLoading ? (
        <div>loading...</div>
      ) : (
        <ul>
          {personsToShow?.map((item) => (
            <Person
              key={item.id}
              details={item}
              onClick={() => {
                handleDelete(item.id);
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
