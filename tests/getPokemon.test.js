const chai = require('chai')
const request = require('chai-http')
chai.should()
chai.use(request)

describe('GET /pokemon', () => {
    it('Should get an array of multiple Pokemon', () => {
        return chai.request('http://localhost:3000')
            .get('/pokemon/')
            .then(response => {
                const pokemon = response.body
                pokemon.should.be.an('array')

                for (const poke of pokemon) {
                    poke.should.have.a.property('name').and.be.an('string')
                    poke.should.have.a.property('price').and.be.an('number')
                    poke.should.have.a.property('stock').and.be.an('number')
                    poke.should.have.a.property('createdAt').and.be.an('string')
                    poke.should.have.a.property('updatedAt').and.be.an('string')
                }
            })
    })

    it('Should get an array with the Lugia Pokemon or an empty array, by using name filter', () => {
        return chai.request('http://localhost:3000')
            .get('/pokemon/')
            .query({ name: 'Lugia' })
            .then(response => {
                response.status.should.be.an('number').and.equal(200)

                const pokemon = response.body
                pokemon.should.be.an('array')

                for (const poke of pokemon) {
                    poke.should.have.a.property('name').and.be.an('string').and.equal('Lugia')
                    poke.should.have.a.property('price').and.be.an('number').and.equal(155)
                    poke.should.have.a.property('stock').and.be.an('number')
                    poke.should.have.a.property('createdAt').and.be.an('string')
                    poke.should.have.a.property('updatedAt').and.be.an('string')
                }
            })
    })

    it('Should get an array with Pokemon that have 155 of price or an empty array, by using price filter', () => {
        return chai.request('http://localhost:3000')
            .get('/pokemon/')
            .query({ price: 155 })
            .then(response => {
                response.status.should.be.an('number').and.equal(200)

                const pokemon = response.body
                pokemon.should.be.an('array')

                for (const poke of pokemon) {
                    poke.should.have.a.property('name').and.be.an('string')
                    poke.should.have.a.property('price').and.be.an('number').and.equal(155)
                    poke.should.have.a.property('stock').and.be.an('number')
                    poke.should.have.a.property('createdAt').and.be.an('string')
                    poke.should.have.a.property('updatedAt').and.be.an('string')
                }
            })
    })

    it('Should get an array with Pokemon that have 144 of stock or an empty array, by using stock filter', () => {
        return chai.request('http://localhost:3000')
            .get('/pokemon/')
            .query({ stock: 144 })
            .then(response => {
                response.status.should.be.an('number').and.equal(200)

                const pokemon = response.body
                pokemon.should.be.an('array')
                
                for (const poke of pokemon) {
                    poke.should.have.a.property('name').and.be.an('string')
                    poke.should.have.a.property('price').and.be.an('number')
                    poke.should.have.a.property('stock').and.be.an('number').and.equal(144)
                    poke.should.have.a.property('createdAt').and.be.an('string')
                    poke.should.have.a.property('updatedAt').and.be.an('string')
                }
            })
    })

    it('Should get an array with Pokemon that have 144 of stock, Mew of name and 123 of price or an empty array, by using stock filter', () => {
        return chai.request('http://localhost:3000')
            .get('/pokemon/')
            .query({ name: 'Mew', price: 123, stock: 144 })
            .then(response => {
                response.status.should.be.an('number').and.equal(200)

                const pokemon = response.body
                pokemon.should.be.an('array')
                
                for (const poke of pokemon) {
                    poke.should.have.a.property('name').and.be.an('string').and.equal('Mew')
                    poke.should.have.a.property('price').and.be.an('number').and.equal(123)
                    poke.should.have.a.property('stock').and.be.an('number').and.equal(144)
                    poke.should.have.a.property('createdAt').and.be.an('string')
                    poke.should.have.a.property('updatedAt').and.be.an('string')
                }
            })
    })

    it('Should return an error if price is a string', () => {
        return chai.request('http://localhost:3000')
            .get('/pokemon/')
            .query({ price: 'asdf' })
            .then(response => {
                response.should.not.exist()
            })
            .catch(({response}) => {
                response.status.should.be.an('number').and.equal(400)
                
                response.body.should.be.an('object')
                response.body.should.have.a.property('error').and.equal('Price needs to be an integer!')
            })
    })

    it('Should return an error if stock is a string', () => {
        return chai.request('http://localhost:3000')
            .get('/pokemon/')
            .query({ stock: 'asdf' })
            .then(response => {
                response.should.not.exist()
            })
            .catch(({response}) => {
                response.status.should.be.an('number').and.equal(400)
                
                response.body.should.be.an('object')
                response.body.should.have.a.property('error').and.equal('Stock needs to be an integer!')
            })
    })
})