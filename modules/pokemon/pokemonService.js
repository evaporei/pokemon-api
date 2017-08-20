const pokemonRepository = require('./pokemonRepository')
const requestPromise = require('request-promise')

exports.getPokemon = (request, response, next) => {
    pokemonRepository.getPokemon(request.query)
        .then(pokemon => response.json(pokemon))
        .catch(error => {
            console.log('error', error)
            response.status(500).json({error: 'Internal Server Error'})
        })
}

exports.createPokemon = (request, response, next) => {
    const pokemon = Object.assign({}, request.body)

    pokemon.price = parseInt(pokemon.price)

    if (isNaN(pokemon.price)) {
        response.status(400).json({error: 'Price needs to be an integer!'})
        return
    }

    if (pokemon.stock) {
        pokemon.stock = parseInt(pokemon.stock)
        if (isNaN(pokemon.stock)) {
            response.status(400).json({error: 'Stock needs to be an integer!'})
            return
        }
    }

    pokemonRepository.createPokemon(request.body)
        .then(pokemon => response.json(pokemon))
        .catch(error => {
            if (error.message.match(/price/g)) {
                response.status(400).json({error: 'Price is mandatory!'})
                return
            }

            if (error.message.match(/name/g)) {
                response.status(400).json({error: 'Name is mandatory!'})
                return
            }
                
            response.status(500).json({error: 'Internal Server Error'})
        })
}

exports.buyPokemon = (request, response, next) => {

    const requestPokemon = Object.assign({}, request.body)

    if (!requestPokemon.name) {
        response.status(400).json({error: 'No pokemon name sent'})
        return
    }

    if (!requestPokemon.quantity) {
        response.status(400).json({error: 'A quantity of pokemon should be sent'})
        return
    }

    requestPokemon.quantity = parseInt(requestPokemon.quantity)

    if (isNaN(requestPokemon.quantity)) {
        response.status(400).json({error: 'The quantity value should be an integer'})
        return
    }

    pokemonRepository.findByName(request.body.name)
        .then(pokemon => {
            if (pokemon === null)
                return response.status(404).json({error: 'Pokemon not found with this name'})
            if (pokemon.stock < requestPokemon.quantity) {
                return response.status(400).json({
                    error: 'Not enought ' + pokemon.name + ' in stock: ' + pokemon.stock
                })
            }

            return requestPromise({
                uri: 'https://api.pagar.me/1/transactions',
                method: 'POST',
                json: {
                    api_key: "ak_test_Hrj7ld8Uf5P5HqCTCf8npUcLljQB7T",
                    amount: pokemon.price * requestPokemon.quantity * 100,
                    card_number: "4024007138010896",
                    card_expiration_date: "1050",
                    card_holder_name: "Ash Ketchum",
                    card_cvv: "123",
                    metadata: {
                        product: 'pokemon',
                        name: pokemon.name,
                        quantity: requestPokemon.quantity
                    }
                }
            })
            .then(body => {
                if (body.status == 'paid') {
                    pokemon.stock = pokemon.stock - requestPokemon.quantity
                    return pokemon.save()
                            .then(pokemon => response.json(body))
                }
            })
            .catch(error => {
                // console.log(JSON.stringify(error, null, 2))
                return response.status(error.response.statusCode).json(error.response.body)
            })
        })
        
        .catch(error => console.log(error))
        
}