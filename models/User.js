const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Joi = require('joi')

//CREATE SCHEMA AND MODEL
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    rule: {
        type: String,
        enum: ['admin', 'shop owner', 'cashier'],
        required: true,
        min: 3,
        max: 50
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    }
})
const User = mongoose.model('User', userSchema)
const user = new User({
    name: "mostafa",
    rule: 'cashier'
})
async function saving() {
    try {
        const result = await user.save()
        console.log(result)
}
    catch (ex) {
        console.log(ex.error)
    }
}
saving()
module.exports = router