const { StatusCodes } = require("http-status-codes")

const errorHandlerMiddleware = (error,req,res,next)=>{
    const customError = {
        statusCode : error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message : error.message || 'Something went wrong'
    } 
    if(error.name === 'validationError'){
      customError.statusCode = 400
      customError.message = Object.values(error.errors).map((item)=> item.message).join(',')
    }
    if(error.code && error.code === 11000){// duplicate key error
      customError.message = `This ${
        Object.keys(error.keyValue)[Object.keys(error.keyValue).length - 1] // modifying the error msg to make it more meaningful
      } already exists`;                                                    // console log 'error' to get better understanding
      customError.statusCode = 400;
    }
    if(error.name === 'castError'){
      customError.statusCode = 404
      customError.message = `No item found with the id:${error.value}`
    }
    return res.status(customError.statusCode).json({
      msg: customError.message,
    });
}

module.exports = errorHandlerMiddleware