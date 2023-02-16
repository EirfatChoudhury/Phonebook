import { useState, useEffect } from 'react'
import Content from './components/Content'
import Filter from './components/Filter'
import Form from './components/Form'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notifMessage, setNotifMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
    }, [])

  const handleChange = (setValue) => (event) => {
    console.log(event.target.value)
    setValue(event.target.value)
  }

  const addNameNumber = (event) => {
    event.preventDefault()
    console.log("button clicked", event.target)

    if (newName === "" || newNumber === "") {
      return alert("No name or number")
    } 

    const nameObject = {
      name: newName,
      number: newNumber
    }

    if (persons.find(person => person.name === newName)) {
      const personToUpdate = persons.find(person => person.name === newName)
      console.log(personToUpdate)
      const tempPersons = persons.filter(person => person.name !== personToUpdate.name)

      personService
      .update(personToUpdate.id, nameObject)
      .then(returnedPerson => {
        const updatedPersons = tempPersons.concat(returnedPerson)
        console.log(updatedPersons)
        setPersons(updatedPersons)
        setNewName('')
        setNewNumber('')
        console.log(returnedPerson)
      })
    }
    
    else {
      personService
      .create(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        console.log(returnedPerson)
      })
    }

    console.log(persons)

    setNotifMessage(`${nameObject.name} was successfully added`)

    setTimeout(() => {setNotifMessage(null)}, 5000)
  }

  const deleteNameNumber = (id) => (event) => {
    console.log("button pressed", event.target)
    console.log(`${id} to be deleted`)

    const delPerson = persons.find(person => person.id === id)

    if (window.confirm(`Delete ${delPerson.name}?`)) {
      personService
      .del(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id ))
      })
    }

    console.log(persons)
  }
  
  return (
    <div>
      <h2>Phonebook App</h2>
      <Notification message={notifMessage} />
      <h2>Filter</h2>
      filter: <Filter value={newFilter} handleChange={handleChange} set={setNewFilter}/>
      <h2>Add name and number</h2>
      <Form onSubmit={addNameNumber} value1={newName} value2={newNumber} handleChange={handleChange} set1={setNewName} set2={setNewNumber}/>
      <h2>Numbers</h2>
      <Content persons={persons} newFilter={newFilter} onClick={deleteNameNumber}/>
    </div>
  )
}

export default App