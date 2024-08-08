const { StatusCodes } = require("http-status-codes")
const customAPIError = require("./customAPIError")

class NotFoundError extends customAPIError{
    constructor(message){
        super(message)
        this.stausCode = StatusCodes.NOT_FOUND
    }
}

module.exports = NotFoundError