'use strict';

const express = require('express')
const app = express()
const port = 8080

const fs = require('fs')
const productsFileName = "./products.json"

function defaultCallback(err) {
	if(err) {
		console.log(err)
	}
}

function refreshFile(fileName) {
	delete require.cache[require.resolve(fileName)]
	return require(fileName)
}

function findProductByTitle(title, substring, onlyInStock) {
    var productsFile = refreshFile(productsFileName)
    var foundProducts = {}

    title = title.toLowerCase()

    if (substring) {
        for (var product in productsFile) {
            if (product.includes(title)) {
                foundProducts[product] = productsFile[product]
            }
        }
    } else {
        if (productsFile[title] != null) {
            foundProducts[title] = productsFile[title]
        }
    }

    return foundProducts
}

function findProductByPrice(priceQuery, threshold, onlyInStock) {
    var productsFile = refreshFile(productsFileName)
    var foundProducts = {}

    for (var product in productsFile) {
        if (threshold == 0) {
            if (productsFile[product].price == priceQuery) {
                foundProducts[product] = productsFile[product]
            }
        } else if (threshold == 1) {
            if (productsFile[product].price >= priceQuery) {
                foundProducts[product] = productsFile[product]
            }
        } else if (threshold == 2) {
            if (productsFile[product].price <= priceQuery) {
                foundProducts[product] = productsFile[product]
            }
        }

    return foundProducts
}

function purchaseProduct(title) {
    var productsFile = refreshFile(productsFileName)

    var product = productsFile[title]
    if (product == null) {
        return 1
    }
    if (product.inventoryCount < 1) {
        return 2
    }
    product.inventoryCount -= 1

    fs.writeFile(productsFileName, JSON.stringify(productsFile, null, 2), defaultCallback)
}

app.use(express.json())

app.post('/createcart', (req, res) => {
    var cart = {}
    cart.products = {}
    cart.total = "$0.00"
    res.send(cart)
})

app.post('/addcart', (req, res) => {
    var cart = req.body.cart
    if (cart == null) {
        res.sendStatus(403)
    }
    var productToAdd = findProductByTitle(req.body.title, false)
    if (Object.keys(productToAdd).length > 1) {
        res.sendStatus(500)
    }
    if (Object.keys(productToAdd).length < 1) {
        res.sendStatus(404)
    }
    cart.products[req.body.title] = productToAdd
    cart.total = "$" + (parseFloat(cart.total.substring(1)) + productToAdd.price).toFixed(2)
    res.send(cart)
})

app.post('/checkoutcart', (req, res) => {
    var cart = req.body.cart
    if (cart == null) {
        res.sendStatus(403)
    }
    for (var product in cart) {
        var status = purchaseProduct(product)
        if (status == 1) {
            res.sendStatus(403)
        }
        if (status == 2) {
            res.sendStatus(404)
        }
    }
    res.sendStatus(200)
})

app.post('/querybytitle', (req, res) => {
    var title = req.body.title
    var onlyInStock = req.body.onlyInStock
    if (title == null || onlyInStock == null) {
        res.sendStatus(400)
    }
    res.send(findProductByTitle(title, true, onlyInStock))
})

app.post('/querybyprice', (req, res) => {
    var price = req.body.price
    var threshold = req.body.threshold
    var onlyInStock = req.body.onlyInStock
    if (!price.isNumber() || threshold == null || onlyInStock == null) {
        res.sendStatus(400)
    }
    switch(threshold) {
        case "exact":
            threshold = 0
            break
        case "above":
            threshold = 1
            break
        case "below":
            threshold = 2
            break
        default:
            res.sendStatus(400)
    }
    res.send(findProductByPrice(price, threshold, onlyInStock))
})

app.listen(port, () => console.log(`Mock Shopify Server started on port ${port}!`))