const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('Give password as an argument')
    process.exit(1)
}

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 } )

const contactSchema = new mongoose.Schema({
    contact: String,
    number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
    contact: process.argv[3],
    number: process.argv[4],
})

if(process.argv.length > 3){
    contact.save().then(result => {
    console.log('contact saved')
    mongoose.connection.close()
    })
}else {
    Contact
    .find({})
    .then(person => {
        person.forEach(contact =>{
            console.log(contact)
        })
        mongoose.connection.close()       
    })
}

