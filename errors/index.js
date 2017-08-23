function loadErrors () {
    class MandatoryFieldError extends Error {
        constructor(message) {
            super(message)
            this.name = 'MandatoryFieldError'
        }
    }
    global.MandatoryFieldError = MandatoryFieldError

    class NotFoundError extends Error {
        constructor(message) {
            super(message)
            this.name = 'NotFoundError'
        }
    }
    global.NotFoundError = NotFoundError
    
    class AlreadyExistsError extends Error {
        constructor(message) {
            super(message)
            this.name = 'AlreadyExistsError'
        }
    }
    global.AlreadyExistsError = AlreadyExistsError

    class CustomError extends Error {
        constructor(message) {
            super(message)
            this.name = 'CustomError'
        }
    }
    global.CustomError = CustomError
}

const errorHandlers = {
    badRequest: (response) => {
        return (error) => {
            console.log(error)
            response.status(400).json({error: error.message})
        }
    },
    internalServer: (response) => {
        return error => {
            console.log(error)
            response.status(500).json({error: 'Internal Server Error'})
        }
    }
}

module.exports = { loadErrors, errorHandlers }