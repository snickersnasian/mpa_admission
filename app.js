const mongoose = require('mongoose')
require('dotenv').config() 
const express = require('express')
const app = express()

const path = require('path')

const PORT = process.env.PORT || 3000


app.use('/api/ticket', require('./routes/ticket.routes'))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

const start = async () => {
    try { 

        await mongoose.connect(process.env.MONGO_DB)

        app.listen(PORT, () => {
            console.log(`App started on port ${PORT}`)
        })

    } catch (err) { 
        console.log(err.message)
    }
}

start()