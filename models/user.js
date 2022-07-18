const mongoose = require("mongoose");
const Schema = mongoose.Schema
const bcrypt = require('bcrypt');


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
      },
    email: {
        type: String,
        required: true,
        unique:true,
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/]
    },
    phone:{
        type: String,
        required: true,
        unique:true,
    },
    password: {
        type: String,
        required: true,
    },
    deletedAt:{
        type:Date
    },
    updatedAt:{
        type:Date
    }
})

userSchema.pre('save',function(next){
    const user = this;
    bcrypt.genSalt(process.env.saltRounds, (error, salt) =>{
        bcrypt.hash(user.password, salt, function(err, hash) {
            // Store hash in your password DB.
            user.password = hash;
            next();
        });
    })
})

module.exports = mongoose.model('User',userSchema)
