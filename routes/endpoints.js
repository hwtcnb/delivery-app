const {Router} = require('express')
const Product = require('../models/Product')
const path = require("path");
const fs = require("fs");
const formidable = require('formidable')

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await Product.find({}).lean()
        for (const product of products) {
            product.picture = product.picture.toString('base64')
        }
        res.render('index', {
            title: 'Main page',
            products
        })
    } catch (e) {
        res.end(e)
    }
})
router.get('/add', async (req, res) => {
    try {
        res.render('addProduct', {
            title: 'Add product'
        })
    } catch (e) {
        res.end(e)
    }
})

router.post('/add', async (req, res) => {
    try {
        const form = new formidable.IncomingForm();
        form.uploadDir = path.join(process.cwd(), 'uploads')
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err);
            }
            const {name, shopName, price} = fields
            const file = files.myFile
            const oldPath = file.filepath
            const newPath = path.join(process.cwd(), 'uploads', file.originalFilename.split('.')[0] + '.png')

            await Product.create({name, shopName, picture: fs.readFileSync(oldPath), price}, (err, item) => {
                if (err) {
                    console.log(err);
                }
                item.save()
            })

            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    console.log(err)
                }
            })
        })
        res.redirect('/')
    } catch (e) {
        res.end(e)
    }
})

router.get('/basket', async (req, res) => {
    let products = [];
    let sum = 0;
    const values = req.headers.cookie || false
    if (values === false) {
        res.render('basket', {
            empty: true,
            title: 'Basket'
        })
    } else {
        let raws = values.split('; ').map(e => e.split('=')[1]).filter(e => !!e)
        for (const raw of raws) {
            const product = await Product.findOne({_id: raw}).lean()
            products.push(product)
        }
        for (const product of products) {
            product.picture = product.picture.toString('base64')
            sum += +product.price
        }
        res.render('basket', {
            products,
            sum,
            title: 'Basket'
        })
    }

})

module.exports = router;