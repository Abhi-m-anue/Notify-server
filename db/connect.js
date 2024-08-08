const mongoose = require('mongoose')

const connectDB = (URI)=>{
    return mongoose.connect(URI,{
        dbName : "Notify-app",
    })
}

module.exports = connectDB