const express = require('express')
const app = express()


let contacts = [
    {
        "id": "1",
        "name": "Arto Hellos",
        "number": "40-01-0234"
    },
    {
        "id": "2",
        "name": "Brandon Benoit",
        "number": "30-04-0234"
    },
    {
        "id": "3",
        "name": "Ada Lovelace",
        "number": "43-51-0636"
    },
    {
        "id": "4",
        "name": "Tommy Martin",
        "number": "13-34-0434"
    }
    
]

app.get('/', (request, response) => {
   response.send('<h1>Hello world</h1>')
})

app.get('/api/info', (request, response) => {
    const numberOfContacts = contacts.length
    const date = new Date()
    
    response.send(
        `<div>
            <h2>Phonebook has info for ${numberOfContacts} people</h2>
            <p>${date.toString()}</p>
        </div>`
    )}
)

app.get('/api/contacts', (request, response) => {
    response.json(contacts)
})

app.get('/api/contacts/:id', (request, response) => {
    const id = request.params.id
    const contact = contacts.find(contact => contact.id === id)

    if(contact){
        response.json(contact)
    }else{
        response.statusMessage = "No contact found for this entry!"
        response.status(404).end()
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
