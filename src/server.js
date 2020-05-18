import express from 'express'
import bodyParser from 'body-parser'

import { validate } from './twsMessageSchema2.0'

const port = 3011
const app = express()
app.use(bodyParser.json())

app.post('/', (req, res) => {
  const validationError = validate(req.body)
  if (validationError) {
    res.status(400).json(validationError)
  } else {
    res.status(200).json('Valid TWS message')
  }
})

app.listen(port, () => {
  console.log(`Aquacheck TWS server example running port: ${port}`)
})
