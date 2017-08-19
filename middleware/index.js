const bodyParser = require('body-parser')
const cors = require('cors')

function applyMiddleware (expressApp) {
    expressApp.use(bodyParser.json())
    expressApp.use(cors())
}

module.exports = applyMiddleware