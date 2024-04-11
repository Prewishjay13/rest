require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

// Only accept application/json and application/x-www-form-urlencoded
app.use(function (req, res, next) {
    if (req.accepts(['application/json', 'application/x-www-form-urlencoded'])) {
        next()
    } else {
        res.status(406).send({
            error: "We only accept application/json & application/x-www-form-urlencoded."
        })
    }
})

app.use(express.json())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const brandsRouter = require('./routes/brands')
app.use('/brands', brandsRouter)




app.listen(3000, () => console.log('Server Started'))