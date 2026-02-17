const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

if(process.argv.length < 3){
  console.log('Give password as an argument')
  process.exit(1)
}

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 } )

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
  contact: process.argv[3],
  number: process.argv[4],
})

if(process.argv.length > 3){
  contact.save().then(() => {
    console.log('contact saved')
    mongoose.connection.close()
  })
}else {
  Contact
    .find({})
    .then(person => {
      person.forEach(contact => {
        console.log(contact)
      })
      mongoose.connection.close()
    })
}

