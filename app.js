require('dotenv').config();
require('express-async-errors');
const express = require("express");
const app = express();
//routers
const authRouter = require('./routes/auth')
const monitorsRoute = require('./routes/monitors')
//connect DB
const connectDB = require('./db/connect')
//middlewares
const errorHandlerMiddleware = require('./middleware/error-handler')
const authMiddleware = require('./middleware/authentication')
const notFoundMiddleware = require("./middleware/not-found.js");
//security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
app.set('trust proxy',1)
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(rateLimit({
    windowMs : 15*60*1000,  //15 minutes
    max : 100               //limit each IP to 100 requests per windowMs 
}))

app.use(express.json());

//monitoring service
require('./services/monitoring.js')

//dummy route for testing
app.get('/',(req,res)=>{
    res.send('Notify app')
})
//routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/monitors',authMiddleware,monitorsRoute)

//using middlewares
app.use(notFoundMiddleware)
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