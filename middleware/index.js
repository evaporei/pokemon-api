const bodyParser = require('body-parser')

function applyMiddleware (expressApp) {
    expressApp.use(bodyParser.json())
}

module.exports = applyMiddleware