const { Pokemon } = require('../../models')

exports.getPokemon = (query = {}) => {
    let pokemonQuery = {
        where: { 
            name: { $like: query.name ? `%${query.name}%` : '%%' },
            price: { $eq: query.price },
            stock: { $eq: query.stock }
            
        }
    }

    if (!query.price)
        delete pokemonQuery.where.price

    if (!query.stock)
        delete pokemonQuery.where.stock

    return Pokemon.findAll(pokemonQuery)
}

exports.createPokemon = (pokemon) => {
    return Pokemon.create(pokemon)
}

exports.findByName = (name) => {
    return Pokemon.findOne({ where: { name }})
}