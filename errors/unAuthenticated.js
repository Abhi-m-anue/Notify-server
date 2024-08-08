const { StatusCodes } = require("http-status-codes");
const customAPIError = require("./customAPIError");

class unAuthenticatedError extends customAPIError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = unAuthenticatedError