const glob = require('glob')
const path = require('path')

function setRoutes (expressApp) {
    glob.sync('./modules/*.js', { ignore: './**/index.js' })
        .forEach(filePath => {
            const route = require(path.resolve(filePath))
            route(expressApp)
        })
}

module.exports = setRoutes
