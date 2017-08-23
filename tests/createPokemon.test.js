const chai = require('chai')
const request = require('chai-http')
chai.should()
chai.use(request)

const uuid = require('uuid/v1')
const pokemonName = uuid()

describe('POST /pokemon', () => {
    it('Should post a unique pokemon and return it', () => {
        return chai.request('http://localhost:3000')
            .post('/pokemon/')
            .send({
                name: pokemonName,
                price: 123,
                stock: 144
            })
            .then(response => {
                response.status.should.be.an('number').and.equal(201)

                const pokemon = response.body
                pokemon.should.be.an('object')
                
                pokemon.should.have.a.property('name').and.be.an('string').and.equal(pokemonName)
                pokemon.should.have.a.property('price').and.be.an('number').and.equal(123)
                pokemon.should.have.a.property('stock').and.be.an('number').and.equal(144)
                pokemon.should.have.a.property('createdAt').and.be.an('string')
                pokemon.should.have.a.property('updatedAt').and.be.an('string')
                
            })
            .catch(error => {
                error.should.not.exist()
            })
    })

    it('Should return a error of missing pokemon name', () => {
        return chai.request('http://localhost:3000')
            .post('/pokemon/')
            .send({
                price: 123,
                stock: 144
            })
            .then(response => {
                response.should.not.exist()
            })
            .catch(({response}) => {
                response.status.should.be.an('number').and.equal(400)
                
                response.body.should.be.an('object')
                response.body.should.have.a.property('error').and.equal('Name is mandatory!')
            })
    })

    it('Should return a error of missing pokemon price', () => {
        return chai.request('http://localhost:3000')
            .post('/pokemon/')
            .send({
                name: pokemonName,
                stock: 144
            })
            .then(response => {
                response.should.not.exist()
            })
            .catch(({response}) => {
                response.status.should.be.an('number').and.equal(400)
                
                response.body.should.be.an('object')
                response.body.should.have.a.property('error').and.equal('Price is mandatory!')
            })
    })

    it('Should return a error of pokemon price not being an integer', () => {
        return chai.request('http://localhost:3000')
            .post('/pokemon/')
            .send({
                name: pokemonName,
                price: 'NOT AN INTEGER',
                stock: 144
            })
            .then(response => {
                response.should.not.exist()
            })
            .catch(({response}) => {
                response.status.should.be.an('number').and.equal(400)
                
                response.body.should.be.an('object')
                response.body.should.have.a.property('error').and.equal('Price needs to be an integer!')
            })
    })

    it('Should return a error of pokemon stock not being an integer', () => {
        return chai.request('http://localhost:3000')
            .post('/pokemon/')
            .send({
                name: pokemonName,
                price: 123,
                stock: 'NOT AN INTEGER'
            })
            .then(response => {
                response.should.not.exist()
            })
            .catch(({response}) => {
                response.status.should.be.an('number').and.equal(400)
                
                response.body.should.be.an('object')
                response.body.should.have.a.property('error').and.equal('Stock needs to be an integer!')
            })
    })

    it('Should return a error of this pokemon name already being used', () => {
        return chai.request('http://localhost:3000')
            .post('/pokemon/')
            .send({
                name: pokemonName,
                price: 123,
                stock: 144
            })
            .then(response => {
                response.should.not.exist()
            })
            .catch(({response}) => {
                response.status.should.be.an('number').and.equal(400)
                
                response.body.should.be.an('object')
                response.body.should.have.a.property('error').and.equal('A pokemon with this name already exists!')
            })
    })
})