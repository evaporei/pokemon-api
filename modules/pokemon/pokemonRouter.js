const pokemonService = require('./pokemonService')

module.exports = {
    baseUrl: '/pokemon',
    routes: [
        {
            method: 'GET',
            route: '/',
            handlers: [
                pokemonService.getPokemon
            ]
        },
        {
            method: 'POST',
            route: '/',
            handlers: [
                pokemonService.createPokemon
            ]
        },
        {
            method: 'POST',
            route: '/buy',
            handlers: [
                pokemonService.buyPokemon
            ]
        }
    ]
}