const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const Product = require('./models/product')
const methodOverride = require('method-override')

// connection to local database
mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CONNECTION OPEN WITH MONGO!")
    })
    .catch(err => {
        console.log("OH NO ERROR WITH MONGO!")
        console.log(err)
    })

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


// open all products page
app.get('/products', async (req, res) => {
    let products = await Product.find({})
    console.log(products.length + " products found and listed.")
    res.render('products', { products })
})

// open new product page
app.get('/products/new', (req, res) => {
    res.render('new')
})

// open edit product page
app.get('/products/edit/:id', async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render('edit', { product })
})

// open product details page
app.get('/products/:id', async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render('details', { product })

})

// POST request : add a new product
app.post('/products', async (req, res) => {
    let product = new Product(req.body)
    await product.save()
    console.log("Added this new product :")
    console.log(product)
    res.redirect(`/products/${product._id}`)
})

// UPDATE request : edit a product
app.put('/edit/:id', async (req, res) => {
    const { id } = req.params
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
    console.log("This product was modified :")
    console.log(product)
    res.redirect(`/products/${product._id}`)
})

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000!")
})
