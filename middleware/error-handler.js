const { StatusCodes } = require("http-status-codes")

const errorHandlerMiddleware = (error,req,res,next)=>{
    const customError = {
        statusCode : error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message : error.message || 'Something went wrong'
    } 
    return res.status(customError.statusCode).json({
      msg: customError.message,
    });
}

module.exports = errorHandlerMiddleware