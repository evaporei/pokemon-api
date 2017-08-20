const express = require('express')
const app = express()
const applyMiddleware = require('./middleware')
const syncModels = require('./models')
const modules = require('./modules')
const PORT = 3000

syncModels()
applyMiddleware(app)
modules(app)

app.listen(PORT, function () {
	console.log(`Listening on http://localhost:${PORT}`)
})
