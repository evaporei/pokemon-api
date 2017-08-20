const glob = require('glob')
const path = require('path')

function syncModels () {
    glob.sync('./models/*.js', { ignore: './**/index.js' })
        .forEach(filePath => {                
            const model = require(path.resolve(filePath))
            model.sync({force: true})
                .then(() => {
                    console.log(`${filePath.replace('./models/', '')
                                .replace('.js', '')
                                .toUpperCase()} model is ready!`)
                })
                .catch(error => {
                    console.log(`Error on loading
                                ${filePath.replace('./models/', '')
                                .replace('.js', '')
                                .toUpperCase()} model.
                                ${error}`)
                })
        })
}

module.exports = syncModels
