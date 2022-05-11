const { model, Schema } = require('mongoose')


const schema = new Schema({
    title: { type: String, required: true},
    date: { type: String, required: true},
    time: { type: String, required: true},
    place: { type: String, required: true},
})

module.exports = model(  "Event", schema)
