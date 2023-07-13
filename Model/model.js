const mongoose = require('mongoose')



const userScehma = mongoose.Schema({

    userName:{
        type: String,
        require:true
    },
    email:{
        type:String,
        require:true
        

    },
    password:{
        type:String,
        required : true
    },
    token:{
        type:String,

    },
    isVerified: {
        type: Boolean,
        default: false
    
    },
    isAdmin: {
        type: Boolean,
        default: false
    
    },
    isSuperAdmin: {
        type: Boolean,
        default: false
    }

    
},{timestamp:true})

const usermodel = mongoose.model("user",userScehma)
module.exports = usermodel;