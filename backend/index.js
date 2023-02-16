const express = require("express")
const morgan = require("morgan")
const cors = require('cors')

app = express()
app.use(express.json())
app.use(express.static('build'))

morgan.token('person', function (req, res) { return JSON.stringify(req.body) })
app.use(
    morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.person(req, res)
    ].join(' ')
  })
)

app.use(cors())

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    const maxId = persons.length

    if (maxId === 0) {
        return maxId
    }
    else {
        return maxId+1
    }
}

app.get("/", (request, response) => {
    response.send("<h1>Phonebook</h1>")
})

app.get("/info", (request, response) => {
    const numberOfObjects = persons.length
    const date = new Date()

    response.send(`
    <p>Phonebook has info for ${numberOfObjects} people</p>
    <p>${date}</p>`)
})

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.post("/api/persons", (request, response) => {
    const body = request.body


    if (!body.name || !body.number) {
        return response.status(400).json({ 
        error: 'content missing' 
        })
    }
    else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({ 
            error: 'name taken' 
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
})