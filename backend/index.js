require('dotenv').config()
const express = require("express")
const morgan = require("morgan")
const cors = require('cors')
const Person = require('./models/person')

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

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

app.get("/", (request, response) => {
    response.send("<h1>Phonebook</h1>")
})

app.get("/info", (request, response) => {
    Person.find({}).then(result => {
        const numberOfPeople = result.length
        const date = new Date()
        response.send(`
        <p>Phonebook has info for ${numberOfPeople} people</p>
        <p>${date}</p>`)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(notes => {
      response.json(notes)
    })
})

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
        error: 'content missing' 
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body
  
    Person.findByIdAndUpdate(
        request.params.id, 
        { name, number },
        { new: true, runValidators: true, context: 'query' }
        )
        .then(updatedNote => {
          response.json(updatedNote)
        })
        .catch(error => next(error))
})