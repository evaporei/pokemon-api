const chai = require('chai')
const request = require('chai-http')
chai.should()
chai.use(request)


const uuid = require('uuid/v1')
const nonexistingPokemonName = uuid()

describe('POST /pokemon/buy', () => {
    it('Should post a unique pokemon and return it', () => {
        return chai.request('http://localhost:3000')
            .post('/pokemon/buy')
            .send({
                name: 'Pikachu',
                quantity: 1
            })
            .then(response => {
                response.status.should.be.an('number').and.equal(200)

                const body = response.body
                body.should.be.an('object')
                
                body.should.have.a.property('object').and.be.an('string').and.equal('transaction')
                body.should.have.a.property('status').and.be.an('string').and.equal('paid')
                body.should.have.a.property('refuse_reason').and.equal(null)
                body.should.have.a.property('status_reason').and.be.an('string').and.equal('acquirer')
                body.should.have.a.property('acquirer_response_code').and.be.an('string').and.equal('0000')
                body.should.have.a.property('acquirer_name').and.be.an('string').and.equal('pagarme')
                body.should.have.a.property('acquirer_id').and.be.an('string').and.equal('5760bbf0f4e0f9b511fe7040')
                body.should.have.a.property('authorization_code').and.be.an('string')
                body.should.have.a.property('soft_descriptor').and.equal(null)
                body.should.have.a.property('tid').and.be.an('number')
                body.should.have.a.property('nsu').and.be.an('number')
                body.should.have.a.property('date_created').and.be.an('string')
                body.should.have.a.property('date_updated').and.be.an('string')
                body.should.have.a.property('amount').and.be.an('number')
                body.should.have.a.property('authorized_amount').and.be.an('number')
                body.should.have.a.property('paid_amount').and.be.an('number')
                body.should.have.a.property('refunded_amount').and.be.an('number')
                body.should.have.a.property('paid_amount').and.be.an('number')
                body.should.have.a.property('installments').and.be.an('number')
                body.should.have.a.property('id').and.be.an('number')
                body.should.have.a.property('cost').and.be.an('number')
                body.should.have.a.property('card_holder_name').and.be.an('string')
                body.should.have.a.property('card_last_digits').and.be.an('string')
                body.should.have.a.property('card_first_digits').and.be.an('string')
                body.should.have.a.property('card_brand').and.be.an('string')
                body.should.have.a.property('card_pin_mode').and.equal(null)
                body.should.have.a.property('postback_url').and.equal(null)
                body.should.have.a.property('payment_method').and.be.an('string')
                body.should.have.a.property('capture_method').and.be.an('string')
                body.should.have.a.property('antifraud_score').and.equal(null)
                body.should.have.a.property('boleto_url').and.equal(null)
                body.should.have.a.property('boleto_barcode').and.equal(null)
                body.should.have.a.property('boleto_expiration_date').and.equal(null)
                body.should.have.a.property('referer').and.be.an('string')
                body.should.have.a.property('ip').and.be.an('string')
                body.should.have.a.property('subscription_id').and.equal(null)
                body.should.have.a.property('phone').and.equal(null)
                body.should.have.a.property('address').and.equal(null)
                body.should.have.a.property('customer').and.equal(null)
                body.should.have.a.property('billing').and.equal(null)
                body.should.have.a.property('shipping').and.equal(null)
                body.should.have.a.property('items').and.be.an('array')

                body.should.have.a.property('card').and.be.an('object')

                    const card = body.card

                    card.should.have.a.property('object').and.be.an('string')
                    card.should.have.a.property('id').and.be.an('string')
                    card.should.have.a.property('date_created').and.be.an('string')
                    card.should.have.a.property('date_updated').and.be.an('string')
                    card.should.have.a.property('brand').and.be.an('string')
                    card.should.have.a.property('holder_name').and.be.an('string').and.equal('Ash Ketchum')
                    card.should.have.a.property('first_digits').and.be.an('string')
                    card.should.have.a.property('last_digits').and.be.an('string')
                    card.should.have.a.property('country').and.be.an('string')
                    card.should.have.a.property('fingerprint').and.be.an('string')
                    card.should.have.a.property('valid').and.be.an('boolean')
                    card.should.have.a.property('expiration_date').and.be.an('string')
                
                body.should.have.a.property('split_rules').and.equal(null)

                body.should.have.a.property('metadata').and.be.an('object')

                    const metadata = body.metadata

                    metadata.should.have.a.property('name').and.be.an('string').and.equal('Pikachu')
                    metadata.should.have.a.property('product').and.be.an('string').and.equal('pokemon')
                    metadata.should.have.a.property('quantity').and.be.an('number')

                body.should.have.a.property('antifraud_metadata').and.be.an('object')
                body.should.have.a.property('reference_key').and.equal(null)
                
            })
            .catch(error => {
                error.should.not.exist()
            })
    })

    it('Should return a error of missing pokemon name', () => {
        return chai.request('http://localhost:3000')
            .post('/pokemon/buy')
            .send({
                quantity: 1
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

    it('Should return a error of missing pokemon quantity', () => {
        return chai.request('http://localhost:3000')
            .post('/pokemon/buy')
            .send({
                name: 'Pikachu'
            })
            .then(response => {
                response.should.not.exist()
            })
            .catch(({response}) => {
                response.status.should.be.an('number').and.equal(400)
                
                response.body.should.be.an('object')
                response.body.should.have.a.property('error').and.equal('Quantity is mandatory!')
            })
    })

    it('Should return a error of pokemon quantity not being an integer', () => {
        return chai.request('http://localhost:3000')
            .post('/pokemon/buy')
            .send({
                name: 'Pikachu',
                quantity: 'NOT AN INTEGER'
            })
            .then(response => {
                response.should.not.exist()
            })
            .catch(({response}) => {
                response.status.should.be.an('number').and.equal(400)
                
                response.body.should.be.an('object')
                response.body.should.have.a.property('error').and.equal('Quantity needs to be an integer!')
            })
    })

    it('Should return a error of pokemon name not being found', () => {
        return chai.request('http://localhost:3000')
            .post('/pokemon/buy')
            .send({
                name: nonexistingPokemonName,
                quantity: 1
            })
            .then(response => {
                response.should.not.exist()
            })
            .catch(({response}) => {
                response.status.should.be.an('number').and.equal(400)
                
                response.body.should.be.an('object')
                response.body.should.have.a.property('error').and.equal('Pokemon not found with this name!')
            })
    })

    it('Should return a error of quantity being bigger than stock', () => {
        return chai.request('http://localhost:3000')
            .post('/pokemon/buy')
            .send({
                name: 'Pikachu',
                quantity: 2000
            })
            .then(response => {
                response.should.not.exist()
            })
            .catch(({response}) => {
                response.status.should.be.an('number').and.equal(400)
                
                response.body.should.be.an('object')
                response.body.should.have.a.property('error').and.match(/^Not enought/)
            })
    })
})