
const { model, Schema } = require('mongoose')


const schema = new Schema({
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    mail: { type: String, required: true},
    event: { type: String, required: true},
    place: { type: String, required: true},
    time: { type: String, required: true}
})

module.exports = model( "Ticket", schema)