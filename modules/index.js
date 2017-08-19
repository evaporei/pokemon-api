const glob = require('glob')
const path = require('path')
const Router = require('express').Router

function setRoutes (expressApp) {
    glob.sync('./modules/*', { ignore: './**/index.js' })
        .forEach(filePath => {
            const routeName = filePath.substring(filePath.lastIndexOf('/') + 1)
            const router = require(`./${routeName}/${routeName}Router`)
            
            const { baseUrl, routes } = router
            const routerInstance = Router()

            routes.forEach(configRoute => {
                const { method, route, handlers } = configRoute

                const lastHandler = handlers.pop()
                
                routerInstance[method.toLowerCase()](route, ...handlers, lastHandler)

                expressApp.use(baseUrl, routerInstance)
            })
        })
}

module.exports = setRoutes
