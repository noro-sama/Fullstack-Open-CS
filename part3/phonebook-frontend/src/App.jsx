import { useState, useEffect } from 'react'
import { PhoneForm, Person, Filter } from './components/phone'
import personsService from './services/persons.js'
import {
  SuccessNotification,
  ErrorNotification,
} from './components/Notification.jsx'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personsService.getAll('http://localhost:3001/persons').then((response) => {
      setPersons(response)
    })
  }, [])

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (newName.trim() === '' || newNumber.trim() === '') {
      alert('please fill in all the fields')
      return
    }

    const nameExists = persons.find((person) => person.name === newName)
    if (nameExists && nameExists.number !== newNumber) {
      const userConfirmed = window.confirm(
        `${nameExists.name} is already added  to the phonebook. Replace old number with new one? This cannot be undone.`,
      )
      if (userConfirmed) {
        personsService
          .updateNumber(nameExists.id, {
            name: nameExists.name,
            number: newNumber,
          })
          .then((returnedContact) => {
            setSuccessMessage(`Contact '${returnedContact.name}' was updated`)
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
            setPersons(
              persons.map((contact) =>
                contact.id !== returnedContact.id ? contact : returnedContact,
              ),
            )
          })
          .catch((err) => {
            setErrorMessage(
              `'${nameExists.name}' was already deleted from server`,
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter((p) => p.id !== nameExists.id))
            console.error('Failed to Update contact', err)
          })
        console.log(persons)
      } else {
        console.log('Contact update canceled by user.')
      }
    } else {
      personsService
        .create({ name: newName, number: newNumber })
        .then((data) => {
          setSuccessMessage(`New contact ${newName} was updated`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
          setPersons(persons.concat(data))
        })
        .catch((error) => {
          setErrorMessage(error.response.data.error)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          console.error(error)
        })
    }
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
  }

  const handleDelete = (id) => {
    const person = personsToShow?.find((person) => person.id === id)
    const userConfirmed = window.confirm(
      `Are you sure you want to delete contact ${person.name}? This cannot be undone.`,
    )

    if (userConfirmed) {
      personsService
        .deleteItem(person.id)
        .then(() => {
          setSuccessMessage(`Contact ${person.name} was successfuly deleted`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
          personsService.getAll().then((updatedPersons) => {
            setPersons(updatedPersons)
          })
        })
        .catch((err) => {
          setErrorMessage(` could not delete contact`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          console.error('Failed to Delete contact', err)
        })
    } else {
      console.log('Deletion canceled by user.')
    }
  }

  const handleSearch = (e) => {
    if (e.target.value !== '') {
      setIsSearching(true)
      setQuery(e.target.value)
    } else {
      setIsSearching(false)
    }
  }

  const personsToShow = isSearching
    ? persons.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />
      <Filter onChange={handleSearch} />
      <h2>Add a new Contact</h2>
      <PhoneForm
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onSubmit={handleFormSubmit}
      />
      <h2>Numbers</h2>
      <ul>
        {personsToShow?.map((item) => (
          <Person
            key={item.id}
            details={item}
            onClick={() => {
              handleDelete(item.id)
            }}
          />
        ))}
      </ul>
    </div>
  )
}

export default App
