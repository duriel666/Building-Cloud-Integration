const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const { default: Ajv } = require('ajv');
const ajv = new Ajv();
const productSchema = require('./schema/product.schema.json');
const productValidator = ajv.compile(productSchema);
const productMw = function(req, res, next) {
    const productResult = productValidator(req.body);
    if (productResult == true) {
        next();
    } else {
        res.sendStatus(400);
    }
}

// deliveryType 1=picked up, 2=posted, 3=delivered
// sellersContact 1=email, 2=phonenumber, 3=onsite message
const products = [{
        "id": uuidv4(),
        "title": "Old computer",
        "description": "Used but in good condition Pentium II",
        "userCategory": "electronics",
        "location": "Kello",
        "image1": null,
        "image2": null,
        "image3": null,
        "image4": null,
        "askingPrice": 4000,
        "dateCreated": "2021-12-01",
        "deliveryType": 1,
        "sellersFirstName": "Janne",
        "sellersContact": 1
    },
    {
        "id": uuidv4(),
        "title": "Couch",
        "description": "Nice leather couch",
        "userCategory": "furniture",
        "location": "Haukipudas",
        "image1": null,
        "image2": null,
        "image3": null,
        "image4": null,
        "askingPrice": 1550,
        "dateCreated": "2022-01-01",
        "deliveryType": 2,
        "sellersFirstName": "Jonna",
        "sellersContact": 2
    },
    {
        "id": uuidv4(),
        "title": "Violin",
        "description": "Lightly used pink violin with extra strings",
        "userCategory": "music",
        "location": "Oulu",
        "image1": null,
        "image2": null,
        "image3": null,
        "image4": null,
        "askingPrice": 200,
        "dateCreated": "2022-02-01",
        "deliveryType": 3,
        "sellersFirstName": "Salla",
        "sellersContact": 3
    }
];

router.get('/', (req, res) => {
    res.json(products);
})

router.get('/:id', (req, res) => {
    let foundIndex = products.findIndex(t => t.id === req.params.id);
    if (foundIndex === -1) {
        res.sendStatus(404);
        return;
    } else {
        res.json(products[foundIndex]);
    }
})

router.get('/category/:userCategory', (req, res) => {
    console.log(req.params.userCategory)
    const result = []
    for (var i in products) {
        if (products[i].userCategory == req.params.userCategory)
            result.push(products[i])
    }
    console.log(result)
    res.json(result)
})

router.get('/location/:location', (req, res) => {
    console.log(req.params.location)
    const result = []
    for (var i in products) {
        if (products[i].location == req.params.location)
            result.push(products[i])
    }
    console.log(result)
    res.json(result)
})

router.get('/created/:dateCreated', (req, res) => {
    console.log(req.params.dateCreated)
    const result = []
    for (var i in products) {
        if (products[i].dateCreated == req.params.dateCreated)
            result.push(products[i])
    }
    console.log(result)
    res.json(result)
})

router.delete('/:id', (req, res) => {
    let foundIndex = -1;
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === req.params.id) {
            foundIndex = i;
            break;
        }
    }

    if (foundIndex === -1) {
        res.sendStatus(404);
        return;
    } else {
        products.splice(foundIndex, 1);
        res.sendStatus(202);
    }
})

router.post('/', productMw, (req, res) => {
    products.push({
        id: uuidv4(),
        title: req.body.title,
        description: req.body.description,
        userCategory: req.body.userCategory,
        location: req.body.location,
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        askingPrice: req.body.askingPrice,
        dateCreated: req.body.dateCreated,
        deliveryType: req.body.deliveryType,
        sellersFirstName: req.body.sellersFirstName,
        sellersContact: req.body.sellersContact
    });
    res.sendStatus(201);
})

router.put('/:id', (req, res) => {
    let foundProduct = products.find(t => t.id === req.params.id);
    if (foundProduct) {
        foundProduct.title = req.body.title;
        foundProduct.description = req.body.description;
        foundProduct.userCategory = req.body.userCategory;
        foundProduct.location = req.body.location;
        foundProduct.askingPrice = req.body.askingPrice;
        foundProduct.dateCreated = req.body.dateCreated;
        foundProduct.deliveryType = req.body.deliveryType;
        foundProduct.sellersFirstName = req.body.sellersFirstName;
        foundProduct.sellersContact = req.body.sellersContact;
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
})

module.exports = router