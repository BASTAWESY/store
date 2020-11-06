const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Joi = require('joi')

//CREATE SCHEMA AND MODEL
const itemSchema = new mongoose.Schema({
    name: {
        type : String ,
        required : true ,
        min : 3 , 
        max : 50
    },
    cost: {
        type : Number ,
        required : true ,
        max : 1000
    },
    date: {
        type: Date,
        default: Date.now()
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
})
const Item = mongoose.model('Item', itemSchema)

//CREATE JOI SCHEMA
const joiItemSchema = Joi.object().keys({
    name: Joi.string().required().min(3).max(30),
    cost: Joi.number().required().min(3).max(30),
    category: Joi.required()
})
const item = new Item({
    name: "juice",
    cost: 500 ,
    category : "5fa4518182ea8013ac85af58"
})
async function saving() {
    try {
        const result = await item.save()
        console.log(result)
    }
    catch (ex) {
        console.log(ex.error)
    }
}
saving()
//create one item
router.post('/', async (req, res) => {
    const result = Joi.validate(req.body, joiItemSchema)
    if (!result.error) {
        const myItem = new Item({
            name: req.body.name,
            cost: req.body.cost,
            category: req.body.category
        })
        await myItem.save()
        res.send(myItem)
    }
    else if (result.error)
        res.status(400).send(result.error['details'][0].message)
})
//get all
router.get('/', async (req, res) => {
    const items = await Item
        .find()
        .populate('category', 'name-_id')
        .select('name')
    res.send(items)
})
//get one
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
        res.send(item)
    } catch (ex) {
        res.status(404).send(ex.message)
    }
})
//delete one
router.delete('/:id', async (req, res) => {
    try {
        console.log('id +++++++++++' + req.params.id)
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            const items = await Item.findByIdAndRemove(req.params.id)
            if (items) {
                res.send('Item of ' + req.params.id + ' is deleted')
                console.log(items)
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
        const newItem = {
            name: req.body.name,
            cost: req.body.cost  ,
            category : req.body.category
        }
        const result = Joi.validate(req.body, joiItemSchema)
        if (!result.error) {
            const item = await Item.findByIdAndUpdate(req.params.id, newItem)
            res.send(newItem)
        } else if (result.error)
            res.status(400).send(result.error['details'][0].message)
    }
    catch (ex) {
        res.status(400).send(ex.message)
    }
})

//create item connected with cat
async function createItem() {
    const item = new Item({
        name: "relation",
        cost: 25,
        category: '5fa350ca86d8592c3010a543'
    })
    try {
        const x = await item.save()
        console.log(x)
    }
    catch (ex) {
        console.log(ex.message)
    }
}
// createItem()
module.exports = router