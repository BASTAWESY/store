const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Joi = require('joi')

//CREATE SCHEMA AND MODEL
const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    field: {
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})
const Shop = mongoose.model('Shop', shopSchema)
const shop = new Shop({
    name : "carfoor" , 
    field : "feeds" , 
    user : "5fa44f223b6c5d294868468b"
})
async function saving() {
    try {
        const result = await shop.save()
        console.log(result)
}
    catch (ex) {
        console.log(ex.error)
    }
}
saving()

module.exports = router