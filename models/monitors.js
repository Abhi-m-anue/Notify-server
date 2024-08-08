const mongoose = require('mongoose')

const monitorSchema = new mongoose.Schema({
    url : {
        type : String,
        required : [true,'Please provide url to monitor'],
    },
    status: {
        type: String,
        enum : ['ok','down'],
        default : 'ok',
    },
    alertMethod : {
        type : String,
        enum : ['email','call','sms'],
        default : 'email'
    },
    alertEmail : {
        type : String,
    },
    createdBy : {
        type : mongoose.Types.ObjectId,
        ref : 'User'
    }
},{timestamps:true})

monitorSchema.index({createdBy : 1,url: 1},{unique : true})     // create a unique index on userId and url
// This ensures a user cannot monitor same url more than once. While different users can monitor the same url

module.exports = mongoose.model('Monitor',monitorSchema)