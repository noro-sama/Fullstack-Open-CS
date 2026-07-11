/* eslint-disable no-unused-vars */
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Contact = require('./models/contact.js')
const app = express()
app.use(express.json())
app.use(express.static('dist'))

morgan.token('data', function getData(res) {
  const body = res.body
  return JSON.stringify(body, null, 2)
})

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :data',
    {
      skip: function (req, res) {
        return req.method !== 'POST'
      },
    },
  ),
)

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.get('/api/persons', (request, response) => {
  Contact.find({}).then((contacts) => {
    response.json(contacts)
  })
})

app.get('/info', (request, response) => {
  const date = new Date()
  const len = persons.length
  response.send(
    `<div><p>Phonebook has info for ${len} people</p><p>${date}</p></div>`,
  )
})

app.get('/api/persons/:id', (req, res) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      res.json(contact)
    })
    .catch((error) => {
      console.log('An error ocurred', error.message)
      res.status(404).end()
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({
      error: 'Name and number are required',
    })
  }
  const newPerson = new Contact({
    name: name,
    number: number,
  })

  newPerson
    .save()
    .then((savedContact) => {
      res.json(savedContact)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({
      error: 'Name and number are required',
    })
  }
  Contact.findById(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).end()
      }
      person.name = name
      person.number = number

      return person.save()
    })
    .then((updatedContact) => {
      res.json(updatedContact)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
