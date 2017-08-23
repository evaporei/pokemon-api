const bluebird = require('bluebird')
global.Promise = bluebird
const errors = require('./errors')
errors.loadErrors()

const express = require('express')
const app = express()

const db = require('./models')

const applyMiddleware = require('./middleware')
const modules = require('./modules')

const PORT = 3000

db.syncModels()
db.sequelize.sync()
	.then(() => {
		console.log('Database connected')

		applyMiddleware(app)
		modules(app)

		app.listen(PORT, function () {
			console.log(`Listening on http://localhost:${PORT}`)
		})
	})
	.catch(error => {
		console.log('db.sequelize.sync error:', error)
	})


