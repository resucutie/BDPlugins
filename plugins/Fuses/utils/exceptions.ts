class TimezoneException extends Error {
    code: string
    constructor(message, code) {
        super(message)
        this.name = "TimezoneException"
        this.code = code
    }
}

class DateException extends Error {
    code: string
    constructor(message, code) {
        super(message)
        this.name = "DateException"
        this.code = code
    }
}

export { TimezoneException, DateException }