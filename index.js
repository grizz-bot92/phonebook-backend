require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Contact = require('./models/contact')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(morgan(':method :url :body'))

app.use(express.static('dist'))

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if(error.name === 'CastError'){
    return res.status(400).send({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

let contacts = [
  {
    'id': '1',
    'name': 'Arto Hellos',
    'number': '40-01-0234'
  },
  {
    'id': '2',
    'name': 'Brandon Benoit',
    'number': '30-04-0234'
  },
  {
    'id': '3',
    'name': 'Ada Lovelace',
    'number': '43-51-0636'
  },
  {
    'id': '4',
    'name': 'Tommy Martin',
    'number': '13-34-0434'
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
  Contact.find({})
    .then(contacts => {
      response.json(contacts)
    })
})

app.get('/api/contacts/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if(contact){
        response.json(contact)
      } else {
        response.status(404).json({ error: 'No contact found for this entry!' })
      }
    })
    .catch(error => next(error))
})

app.delete('/api/contacts/:id', (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/contacts', (request, response, next) => {
  const body = request.body

  const nameExists = contacts.some(c => c.name === body.name)

  if(!body.name || !body.number) {
    return response.status(404).json({
      error: 'Contact information missing'
    })
  }

  if(nameExists){
    return response.status(404).json({
      error: 'Contact already exists'
    })
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  })

  contact.save()
    .then(savedContact => {
      response.json(savedContact)
    })
    .catch(error => next(error))
})

app.put('/api/contacts/:id', (request, response, next) => {
  console.log(request.body)
  const { name, number } = request.body || {}


  if(!name || !number){
    return response.status(400).json({ error: 'request body missing name or number' })
  }

  Contact.findById(request.params.id)
    .then(contact => {
      if(!contact){
        return response.status(404).end()
      }
      contact.name = name
      contact.number = number

      return contact.save()
        .then((updatedContact) => {
          response.json(updatedContact)
        })
    })
    .catch(error => next(error))
})

morgan.token('body', req => {
  return JSON.stringify(req.body)
})


app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
