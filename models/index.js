const glob = require('glob')
const path = require('path')

function syncModels () {
    glob.sync('./models/*.js')
        .forEach(filePath => {
            if (filePath === './models/index.js')
                return
                
            const model = require(path.resolve(filePath))
            model.sync({force: true})
                .then(() => {
                    console.log(`${filePath.replace('./models/', '')
                                .replace('.js', '')
                                .toUpperCase()} model is ready!`)
                })
        })
}

module.exports = syncModels
