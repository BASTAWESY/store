const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Joi = require('joi')

//CREATE SCHEMA AND MODEL
const categorySchema = new mongoose.Schema({
    name: {
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
const Category = mongoose.model('Category', categorySchema)

const category = new Category({
    name: "drinks",
    user: "5fa44f223b6c5d294868468b"
})
async function saving() {
    try {
        const result = await category.save()
        console.log(result)
    }
    catch (ex) {
        console.log(ex.error)
    }
}
saving()

//CREATE JOI SCHEMA
// const joiCategorySchema = Joi.object().keys({
//     name: Joi.string().required().min(3).max(30),
//     date: Joi.date().required,
//     user: Joi.required()
// })

// const category = new Category({
//     name: "juice",
//     cost: 500
// })
// //create one category
// router.post('/', async (req, res) => {
//     const result = Joi.validate(req.body, joiCategorySchema)
//     if (!result.error) {
//         const myCategory = new Category({
//             name: req.body.name,
//             cost: req.body.cost
//         })
//         await myCategory.save()
//         res.send(myCategory)
//     }
//     console.log(result.error)
//     res.status(400).send(result.error['details'][0].message)
// })
// //get all
// router.get('/', async (req, res) => {
//     const categorys = await Category.find()
//     res.send(categorys)
// })
// //get one
// router.get('/:id', async (req, res) => {
//     try {
//         const category = await Category.findById(req.params.id)
//         res.send(category)
//     } catch (ex) {
//         res.status(404).send(ex.message)
//     }
// })
// //delete one
// router.delete('/:id', async (req, res) => {
//     try {
//         console.log('id +++++++++++' + req.params.id)
//         if (mongoose.Types.ObjectId.isValid(req.params.id)) {
//             const categorys = await Category.findByIdAndRemove(req.params.id)
//             if (categorys) {
//                 res.send('category of ' + req.params.id + ' is deleted')
//                 console.log(categorys)
//             }
//             else
//                 res.status(400).send('NO ID CALLED .. ' + req.params.id)
//         }
//         else
//             res.status(400).send('casting is failed or there id no id written ...' + req.params.id)
//     }
//     catch (ex) {
//         res.send(ex.message)
//     }
// })
// //modify one
// router.put('/:id', async (req, res) => {
//     try {
//         const newCategory = {
//             name: req.body.name,
//             cost: req.body.cost
//         }
//         const result = Joi.validate(req.body, joiCategorySchema)
//         if (!result.error) {
//             const category = await category.findByIdAndUpdate(req.params.id, newCategory)
//             res.send(newCategory)
//         } else if (result.error)
//             res.status(400).send(result.error['details'][0].message)
//     }
//     catch (ex) {
//         res.status(400).send(ex.message)
//     }
// })
module.exports = router