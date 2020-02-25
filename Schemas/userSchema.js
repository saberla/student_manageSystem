const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    num:{
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    identity: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

let User = mongoose.model('students', UserSchema)
module.exports = User