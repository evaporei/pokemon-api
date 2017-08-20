const pokemonRepository = require('./pokemonRepository')
const requestPromise = require('request-promise')

exports.getPokemon = (request, response, next) => {
    pokemonRepository.getPokemon(request.query)
        .then(pokemon => response.json(pokemon))
        .catch(error => {
            console.log('error', error)
            response.status(500).json({error: 'Internal Server error'})
        })
}

exports.createPokemon = (request, response, next) => {
    pokemonRepository.createPokemon(request.body)
        .then(pokemon => response.json(pokemon))
        .catch(error => response.status(500).json({error: 'Internal Server error'}))
}

exports.buyPokemon = (request, response, next) => {
    pokemonRepository.findByName(request.body.name)
        .then(pokemon => {
            if (pokemon === null)
                return response.status(404).json({error: 'Pokemon not found with this name'})
            if (pokemon.stock < request.body.quantity) {
                return response.status(400).json({
                    error: 'Not enought ' + pokemon.name + ' in stock: ' + pokemon.stock
                })
            }

            return requestPromise({
                uri: 'https://api.pagar.me/1/transactions',
                method: 'POST',
                json: {
                    api_key: "******",
                    amount: pokemon.price * request.body.quantity * 100,
                    card_number: "4024007138010896",
                    card_expiration_date: "1050",
                    card_holder_name: "Ash Ketchum",
                    card_cvv: "123",
                    metadata: {
                        product: 'pokemon',
                        name: pokemon.name,
                        quantity: request.body.quantity
                    }
                }
            }).catch(error => {
                // console.log(JSON.stringify(error, null, 2))
                return response.status(error.response.statusCode).json(error.response.body)
            })
        })
        .then(body => {
            if (body.status == 'paid') {

                pokemon.stock = pokemon.stock - request.body.quantity
                return pokemon.save()
                        .then(pokemon => response.json(body))
                    
            }
        })
        .catch(error => console.log(error))
        
}