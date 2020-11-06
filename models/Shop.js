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
    name: "carfoor",
    field: "feeds",
    user: "5fa44f223b6c5d294868468b"
})
//CREATE JOI SCHEMA
const joiShopSchema = Joi.object().keys({
    name: Joi.string().min(3).max(30).required(),
    date: Joi.date(),
    field : Joi.string().required(),
    user: Joi.required()
})

//create one shop
router.post('/', async (req, res) => {
    const result = Joi.validate(req.body, joiShopSchema)
    if (!result.error) {
        const myShop = new Shop({
            name: req.body.name,
            field :req.body.field ,
            user: req.body.user
        })
        await myShop.save()
        res.send(myShop)
    }
    console.log(result.error)
    if (result.error)
        res.status(400).send(result.error['details'][0].message)
})
//get all
router.get('/', async (req, res) => {
    const shops = await Shop
        .find()
        .populate("user", "rule name -_id")
        .select("name")
    res.send(shops)
})
//get one
router.get('/:id', async (req, res) => {
    try {
        const shop = await Shop
        .findById(req.params.id)
        .populate("user" , "name rule")
        res.send(shop)
    } catch (ex) {
        res.status(404).send(ex.message)
    }
})
//delete one
router.delete('/:id', async (req, res) => {
    try {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            const shops = await Shop.findByIdAndRemove(req.params.id)
            if (shops) {
                res.send('shop of ' + req.params.id + ' is deleted')
                console.log(shops)
            }
            else
                res.status(400).send('NO ID CALLED .. ' + req.params.id)
        }
        else
            res.status(400).send('casting is failed or there id no id written ...' + req.params.id)
    }
    catch (ex) {
        res.send(ex.message)
    }
})
//modify one
router.put('/:id', async (req, res) => {
    try {
        const result = Joi.validate(req.body, joiShopSchema)
        if (!result.error) {
            const shop = await Shop.findByIdAndUpdate(req.params.id, {
                $set: {
                    name: req.body.name,
                    user: req.body.user ,
                    field : req.body.field
                }
            }, { new: true })
            res.send(shop)
        } else if (result.error)
            res.status(400).send(result.error['details'][0].message)
    }
    catch (ex) {
        res.status(400).send(ex.message)
        console.log(ex)
    }
})

module.exports = router