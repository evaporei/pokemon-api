const { Pokemon } = require('../../models')

exports.getPokemon = (query = {}) => {
    let pokemonQuery = {
        where: { 
            $and: [
                {name: { $like: query.name ? `%${query.name}%` : '%%' }},
                {price: { $eq: query.price }},
                {stock: { $eq: query.stock }}
            ]
        }
    }

    if (!query.price) {
        let priceObject = pokemonQuery.where.$and.find(obj => obj.price)
        let indexOfPriceObject = pokemonQuery.where.$and.indexOf(priceObject)
        pokemonQuery.where.$and.splice(indexOfPriceObject)
    }

    if (!query.stock) {
        let stockObject = pokemonQuery.where.$and.find(obj => obj.stock)
        let indexOfStockObject = pokemonQuery.where.$and.indexOf(stockObject)
        pokemonQuery.where.$and.splice(indexOfStockObject)
    }

    return Pokemon.findAll(pokemonQuery)
}

exports.createPokemon = (pokemon) => {
    return Pokemon.create(pokemon)
}

exports.findByName = (name) => {
    return Pokemon.findOne({ where: { name }})
}