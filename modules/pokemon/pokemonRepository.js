const Pokemon = require('../../models/pokemon')

exports.getPokemon = () => {
    return Pokemon.findAll()
}

exports.createPokemon = (pokemon) => {
    return Pokemon.create(pokemon)
}

exports.findByName = (name) => {
    return Pokemon.findOne({ where: { name }})
}