const glob = require('glob')
const path = require('path')

const db = {}

const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
	pool: {
		maxIdleTime: 30000
	},
    host: process.env.DATABASE_HOST,
    port: 3306,
    dialect: 'mysql'
})

function syncModels () {
    glob.sync('./models/*.js', { ignore: './**/index.js' })
        .forEach(filePath => {
            const model = sequelize.import(path.resolve(filePath))
            
            let modelName = filePath.replace('.js', '').replace('./models/', '')
            modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1)

            db[modelName] = model
        })
}

db.syncModels = syncModels
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db