function makeErrorCLass(name: string) {
    class TemplateException extends Error {
        code: string
        constructor(message: string, code: any) {
            super(message)
            this.name = name
            this.code = code
            this.message = `${message}. Error code: ${code}`
        }
    }
    return TemplateException
}

const TimezoneException = makeErrorCLass("TimezoneException"),
    DateException = makeErrorCLass("DateException"),
    ImportFileException = makeErrorCLass("FileException"),
    UserListException = makeErrorCLass("UserListException")

export {
    TimezoneException,
    DateException,
    ImportFileException,
    UserListException
}