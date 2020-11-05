const express = require('express')
const app = express()
const mongoose = require('mongoose')
const itemsRouter = require('./models/Item')
const userRouter = require('./models/User')
const shopRouter = require('./models/Shop')
const categoryRouter = require('./models/Category')

app.use(express.json())
app.use('/store/item',itemsRouter)
app.use('/store/category',categoryRouter)
app.use('/store/user',userRouter)
app.use('/store/shop',shopRouter)

//DB CONNECTION
mongoose.connect('mongodb://localhost/store', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(console.log('DB IS CONNECTED'))
    .catch((err) => { console.log(err.message) })
//WEB SERVER     
app.listen(5000, () => { console.log('running on 5000') })
