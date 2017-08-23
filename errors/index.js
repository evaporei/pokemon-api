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

module.exports = loadErrors