const pokemonRepository = require('./pokemonRepository')
const requestPromise = require('request-promise')

exports.getPokemon = (request, response, next) => {
    pokemonRepository.getPokemon(request.query)
        .then(pokemon => response.json(pokemon))
        .catch(Error, error => {
            console.log('getPokemon() error:', error)
            response.status(500).json({error: 'Internal Server Error'})
        })
}

exports.createPokemon = (request, response, next) => {
    Promise.resolve()
    .then(() => {
        const pokemon = Object.assign({}, request.body)

        if (!pokemon.name)
            throw new MandatoryFieldError('Name is mandatory!')

        if (!pokemon.price)
            throw new MandatoryFieldError('Price is mandatory!')

        pokemon.price = parseInt(pokemon.price)

        if (isNaN(pokemon.price))
            throw new TypeError('Price needs to be an integer!')

        if (pokemon.stock) {
            pokemon.stock = parseInt(pokemon.stock)

            if (isNaN(pokemon.stock))
                throw new TypeError('Stock needs to be an integer!')
        }

        return pokemonRepository.createPokemon(pokemon)
    })
    .then(pokemon => response.json(pokemon))
    .catch(TypeError, typeError => {
        console.log('createPokemon() typeError:', typeError)
        response.status(400).json({error: typeError.message})
    })
    .catch(MandatoryFieldError, mandatoryFieldError => {
        console.log('createPokemon() mandatoryFieldError:', mandatoryFieldError)
        response.status(400).json({error: mandatoryFieldError.message})
    })
    .catch(Error, error => {
        console.log('createPokemon() error:', error)
        response.status(500).json({error: 'Internal Server Error'})
    })
}

exports.buyPokemon = (request, response, next) => {

    const requestPokemon = Object.assign({}, request.body)

    Promise.resolve()
    .then(() => {
        if (!requestPokemon.name)
            throw new MandatoryFieldError('Name is mandatory!')

        if (!requestPokemon.quantity)
            throw new MandatoryFieldError('Quantity is mandatory!')

        requestPokemon.quantity = parseInt(requestPokemon.quantity)

        if (isNaN(requestPokemon.quantity))
            throw new TypeError('Quantity should be an integer')

        return pokemonRepository.findByName(requestPokemon.name)
    })
    .then(pokemon => {
        if (pokemon === null)
            throw new NotFoundError('Pokemon not found with this name')
            
        if (pokemon.stock < requestPokemon.quantity)
            throw new CustomError('Not enought ' + pokemon.name + ' in stock: ' + pokemon.stock)

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
        }).then(apiResponse => {
            return { apiResponse, pokemon }
        }).catch(externalApiError => {
            console.log('buyPokemon() externalApiError', externalApiError)
            response.status(externalApiError.response.statusCode).json(externalApiError.response.body)
        })
    })
    .then(({ apiResponse, pokemon }) => {
        if (apiResponse.status != 'paid')
            throw new CustomError('Transaction was not paid')

        pokemon.stock = pokemon.stock - requestPokemon.quantity

        return pokemon.save()
            .then(pokemon => apiResponse)
    })
    .then(apiResponse => response.json(apiResponse))
    .catch(MandatoryFieldError, mandatoryFieldError => {
        console.log('buyPokemon() mandatoryFieldError:', mandatoryFieldError)        
        response.status(400).json({error: mandatoryFieldError.message})
    })
    .catch(TypeError, typeError => {
        console.log('buyPokemon() typeError:', typeError)        
        response.status(400).json({error: typeError.message})
    })
    .catch(NotFoundError, notFoundError => {
        console.log('buyPokemon() notFoundError:', notFoundError)        
        response.status(400).json({error: notFoundError.message})
    })
    .catch(CustomError, customError => {
        console.log('buyPokemon() customError:', customError)
        response.status(400).json({error: customError.message})
    })
    .catch(Error, error => {
        console.log('buyPokemon() error:', error)
        response.status(500).json({error: 'Internal Server Error'})
    })
    
}