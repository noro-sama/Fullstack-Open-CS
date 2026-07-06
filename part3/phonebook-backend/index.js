const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());

morgan.token("data", function getData(res) {
  const body = res.body;
  return JSON.stringify(body, null, 2);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :data",
    {
      skip: function (req, res) {
        return req.method !== "POST";
      },
    },
  ),
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const date = new Date();
  const len = persons.length;
  response.send(
    `<div><p>Phonebook has info for ${len} people</p><p>${date}</p></div>`,
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const contact = persons.find((person) => person.id === id);
  if (id) {
    res.json(contact);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

const generateID = () => {
  const id = Math.floor(Math.random() * 770 + persons.length);
  return String(id);
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(404).json({
      error: "name missing",
    });
  } else if (!body.number) {
    return res.status(404).json({
      error: "number missing",
    });
  }

  const contactExists = persons.find((p) => p.name === body.name);

  if (contactExists) {
    return res.status(409).json({
      error: "name aready exists. all names should be unique",
    });
  } else {
    const person = {
      id: generateID(),
      name: body.name,
      number: body.number,
    };

    persons = persons.concat(person);
    res.json(person);
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
