const express = require('express')
const app = express()
const request = require('request-promise')
const applyMiddleware = require('./middleware')
const syncModels = require('./models')
const setRoutes = require('./modules')
const PORT = 3000
syncModels()

applyMiddleware(app)
setRoutes(app)

app.listen(PORT, function () {
	console.log(`Listening on http://localhost:${PORT}`)
})
