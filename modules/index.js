const glob = require('glob')
const path = require('path')

function setRoutes (expressApp) {
    glob.sync('./modules/*.js')
        .forEach(filePath => {
            if (filePath === './modules/index.js')
                return
            
            const route = require(path.resolve(filePath))
            route(expressApp)
        })
}

module.exports = setRoutes
