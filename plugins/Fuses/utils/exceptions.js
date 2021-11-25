class TimezoneException extends Error {
    constructor(message, code) {
        super(message)
        this.name = "TimezoneException"
        this.code = code
    }
}

class DateException extends Error {
    constructor(message, code) {
        super(message)
        this.name = "DateException"
        this.code = code
    }
}

export { TimezoneException, DateException }