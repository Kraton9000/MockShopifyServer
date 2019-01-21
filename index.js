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

function addProductToList(list, title, product, onlyInStock) {
    if (!onlyInStock || product.inventoryCount > 0) {
        list[title] = product
    }
    return list

}

function updateCartTotal(cart, priceToAdd) {
    var total = parseFloat(cart.total.substring(1)) 
    cart.total = "$" + (total + priceToAdd).toFixed(2)
}

function findProductByTitle(title, substring, onlyInStock) {
    var productsFile = refreshFile(productsFileName)
    var foundProducts = {}

    title = title.toLowerCase()

    if (substring) {
        for (var product in productsFile) {
            if (product.includes(title)) {
                addProductToList(foundProducts, product, productsFile[product], onlyInStock)
            }
        }
    } else {
        if (productsFile[title] != null) {
            addProductToList(foundProducts, title, productsFile[title], onlyInStock)
        }
    }

    return foundProducts
}

function findProductByPrice(priceQuery, threshold, onlyInStock) {
    var productsFile = refreshFile(productsFileName)
    var foundProducts = {}

    for (var product in productsFile) {
        var price = parseFloat(productsFile[product].price.substring(1))
        if (threshold == 0) {
            if (price == priceQuery) {
                addProductToList(foundProducts, product, productsFile[product], onlyInStock)
            }
        } else if (threshold == 1) {
            if (price >= priceQuery) {
                addProductToList(foundProducts, product, productsFile[product], onlyInStock)
            }
        } else if (threshold == 2) {
            if (price <= priceQuery) {
                addProductToList(foundProducts, product, productsFile[product], onlyInStock)
            }
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

    fs.writeFileSync(productsFileName, JSON.stringify(productsFile, null, 2), defaultCallback)
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
    } else if (cart.products[req.body.product] != null) {
        res.sendStatus(400)
    } else {
        var productToAdd = findProductByTitle(req.body.product, false, true)
        if (Object.keys(productToAdd).length < 1) {
            res.sendStatus(404)
        } else {
            productToAdd = productToAdd[req.body.product]
            cart.products[req.body.product] = productToAdd

            var addedPrice = parseFloat(productToAdd.price.substring(1))
            updateCartTotal(cart, addedPrice)

            delete cart.products[req.body.product].inventoryCount
            res.send(cart)
        }
    }
})

app.post('/removecart', (req, res) => {
    var cart = req.body.cart
    if (cart == null) {
        res.sendStatus(403)
    } else {
        if (cart.products[req.body.product] == null) {
            res.sendStatus(400)
        } else {
            var removedPrice = parseFloat(cart.products[req.body.product].price.substring(1)) * -1
            updateCartTotal(cart, removedPrice)
            
            delete cart.products[req.body.product]
            res.send(cart)
        }
    }
})

app.post('/checkoutcart', (req, res) => {
    var cart = req.body.cart
    if (cart == null) {
        res.sendStatus(403)
    } else {
        for (var product in cart.products) {
            var status = purchaseProduct(product)
            if (status == 1) {
                res.sendStatus(403)
                break;
            } else if (status == 2) {
                res.sendStatus(404)
                break;
            }
        }
        if (!res.headersSent) {
            res.sendStatus(200)
        }
    }
})

app.post('/querybytitle', (req, res) => {
    var title = req.body.title
    var onlyInStock = req.body.onlyInStock
    if (title == null || onlyInStock == null) {
        res.sendStatus(400)
    } else {
        res.send(findProductByTitle(title, true, onlyInStock))
    }
})

app.post('/querybyprice', (req, res) => {
    var price = req.body.price
    var threshold = req.body.threshold
    var onlyInStock = req.body.onlyInStock
    if (typeof(price) != 'number' || threshold == null || onlyInStock == null) {
        res.sendStatus(400)
    } else {
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
        if (typeof(threshold) == 'number') {
            res.send(findProductByPrice(price, threshold, onlyInStock))
        }
    }
})

app.listen(port, () => console.log(`Mock Shopify Server started on port ${port}!`))