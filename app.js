require('dotenv').config();
require('express-async-errors');
const authRouter = require('./routes/auth')
const monitorsRoute = require('./routes/monitors')
const connectDB = require('./db/connect')
const errorHandlerMiddleware = require('./middleware/error-handler')
const authMiddleware = require('./middleware/authentication')

const express = require('express')
const app = express();


app.use(express.json());

//monitoring service
// require('./services/monitoring.js')

//routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/monitors',authMiddleware,monitorsRoute)

//middlewares
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000 ;

const start = async()=>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port,()=>{
            console.log(`server is listening on port ${port}...`)
        })
    }
    catch(err){
        console.log(err)
    }    
}

start(); 