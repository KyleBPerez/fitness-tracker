// create the express server here
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const client = require('./db/client')
const apiRouter = require('./api')
const { PORT = 3000 } = process.env

const app = express()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

app.use('/api', apiRouter)

app.get('*', (req, res, next) => {
  res.status(404).send('PAGE NOT FOUND')
})

app.use((error, req, res, next) => {
  res.status(500).send(error)
})

app.listen(PORT, () => {
  client.connect()
  console.log(`Server is up one http://localhost:${PORT}`)
})
