const pokemonRepository = require('./pokemonRepository')
const requestPromise = require('request-promise')
const { errorHandlers } = require('../../errors')

exports.getPokemon = (request, response, next) => {
    const pokemonQuery = Object.assign({}, request.query)

    Promise.resolve()
    .then(() => {
        if (pokemonQuery.price) {
            pokemonQuery.price = parseInt(pokemonQuery.price)
            if (isNaN(pokemonQuery.price))
                throw new TypeError('Price needs to be an integer!')
        }

        if (pokemonQuery.stock) {
            pokemonQuery.stock = parseInt(pokemonQuery.stock)
            if (isNaN(pokemonQuery.stock))
                throw new TypeError('Stock needs to be an integer!')
        }

        return pokemonRepository.getPokemon(pokemonQuery)
    })
    .then(pokemon => response.json(pokemon))
    .catch(TypeError, errorHandlers.badRequest(response))
    .catch(Error, errorHandlers.internalServer(response))
}

exports.createPokemon = (request, response, next) => {
    const requestPokemon = Object.assign({}, request.body)

    Promise.resolve()
    .then(() => {
        if (!requestPokemon.name)
            throw new MandatoryFieldError('Name is mandatory!')

        if (!requestPokemon.price)
            throw new MandatoryFieldError('Price is mandatory!')

        requestPokemon.price = parseInt(requestPokemon.price)

        if (isNaN(requestPokemon.price))
            throw new TypeError('Price needs to be an integer!')

        if (requestPokemon.stock) {
            requestPokemon.stock = parseInt(requestPokemon.stock)

            if (isNaN(requestPokemon.stock))
                throw new TypeError('Stock needs to be an integer!')
        }

        return pokemonRepository.findByName(requestPokemon.name)
    })
    .then(pokemon => {
        if (pokemon !== null)
            throw new AlreadyExistsError('A pokemon with this name already exists!')
        
        return pokemonRepository.createPokemon(requestPokemon)
    })
    .then(pokemon => response.status(201).json(pokemon))
    .catch(TypeError, errorHandlers.badRequest(response))
    .catch(MandatoryFieldError, errorHandlers.badRequest(response))
    .catch(AlreadyExistsError, errorHandlers.badRequest(response))
    .catch(Error, error => errorHandlers.internalServer(response))
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
            throw new TypeError('Quantity needs to be an integer!')

        return pokemonRepository.findByName(requestPokemon.name)
    })
    .then(pokemon => {
        if (pokemon === null)
            throw new NotFoundError('Pokemon not found with this name!')
            
        if (pokemon.stock < requestPokemon.quantity)
            throw new CustomError('Not enought ' + pokemon.name + ' in stock: ' + pokemon.stock + '!')

        return requestPromise({
            uri: 'https://api.pagar.me/1/transactions',
            method: 'POST',
            json: {
                api_key: "******",
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
            console.log(externalApiError)
            response.status(externalApiError.response.statusCode).json(externalApiError.response.body)
        })
    })
    .then(({ apiResponse, pokemon }) => {
        if (apiResponse.status != 'paid')
            throw new CustomError('Transaction was not paid!')

        pokemon.stock = pokemon.stock - requestPokemon.quantity

        return pokemon.save()
            .then(pokemon => apiResponse)
    })
    .then(apiResponse => response.json(apiResponse))
    .catch(MandatoryFieldError, errorHandlers.badRequest(response))
    .catch(TypeError, errorHandlers.badRequest(response))
    .catch(NotFoundError, errorHandlers.badRequest(response))
    .catch(CustomError, errorHandlers.badRequest(response))
    .catch(Error, error => errorHandlers.internalServer(response))
    
}