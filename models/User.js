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
        min: 3,
        max: 50,
        required: true
    },
    mail: {
        type: String,
        required: true,
        unique: true,
        min: 10,
        max: 255
    },
    password: {
        type: String,
        required: true,
        unique: true,
        min: 10,
        max: 255
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    }
})
const User = mongoose.model('User', userSchema)

//CREATE JOI SCHEMA
const joiUserSchema = Joi.object().keys({
    name: Joi.string().required().min(3).max(30),
    rule: Joi.string().required(),
    mail: Joi.string().max(255).min(10).required(),
    password: Joi.string().max(255).min(10).required()
})

//create registration
router.post('/', async (req, res) => {
    const result = Joi.validate(req.body, joiUserSchema)
    if (!result.error) {
        const userCheck = await User.findOne({ mail: req.body.mail })
        if (userCheck)
            res.status(400).send('this mail already registerd here ..!!')
        else if (!userCheck) {
            const myUser = new User({
                name: req.body.name,
                rule: req.body.rule,
                mail: req.body.mail,
                password: req.body.password
            })
            await myUser.save()
            res.send(myUser)
        }
    }
    else if (result.error)
        res.status(400).send(result.error['details'][0].message)
})
//get all
router.get('/', async (req, res) => {
    const rules = await User
        .find()
        .select('name rule')
    res.send(rules)
})
//get one
router.get('/:id', async (req, res) => {
    try {
        const rule = await User.findById(req.params.id)
        res.send(rule)
    } catch (ex) {
        res.status(404).send(ex.message)
    }
})
//delete one
router.delete('/:id', async (req, res) => {
    try {
        console.log('id +++++++++++' + req.params.id)
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            const rules = await Item.findByIdAndRemove(req.params.id)
            if (rules) {
                res.send('User of ' + req.params.id + ' is deleted')
                console.log(rules)
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
        const newUser = {
            name: req.body.name,
            rule: req.body.rule
        }
        const result = Joi.validate(req.body, joiUserSchema)
        if (!result.error) {
            const rule = await User.findByIdAndUpdate(req.params.id, newUser)
            res.send(newUser)
        } else if (result.error)
            res.status(400).send(result.error['details'][0].message)
    }
    catch (ex) {
        res.status(400).send(ex.message)
    }
})

module.exports = router
