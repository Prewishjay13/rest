const express = require('express')
const router = express.Router()
const Brand = require('../models/brand')

// Getting All
router.get('/', async (req, res) => {

  let page = Math.round(req.query.start || 1);
  const totalItems = await Brand.estimatedDocumentCount().exec();
  const itemsPerPage = + parseInt(req.query.limit) || totalItems;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  try {
      const totalItems = await Brand.estimatedDocumentCount().exec();

      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

      const brands = await Brand.find()
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.start))
      res.json({
          "items": brands, 
          "_links": {
              "self": {
                  "href": 'http://145.24.222.99:3000/brands/'
              }
          },
          "pagination": {
              "currentpage": page,
              "currentItems": brands.length,
              "totalPages": totalPages,
              "totalItems": totalItems,
              "_links": {
                  "first": {
                      "page": "http://145.24.222.99:3000/brands",
                      "href": `http://145.24.222.99:3000/brands/?start=1&limit=${itemsPerPage}`
                  },
                  "last": {
                      "page": "http://145.24.222.99:3000/brands",
                      "href": `http://145.24.222.99:3000/brands/?start=${totalPages}&limit=${itemsPerPage}`
                  },
                  "previous": {
                      "page": "http://145.24.222.99:3000/brands",
                      "href": `http://145.24.222.99:3000/brands/?start=${page == 1 ? 1 : page - 1}&limit=${itemsPerPage}`
                  },
                  "next": {
                      "page": "http://145.24.222.99:3000/brands",
                      "href": `http://145.24.222.99:3000/brands/?start=${page == totalPages ? totalPages : page + 1}&limit=${itemsPerPage}`
                  }
              }
          }
      })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getBrand(req, res, next) {
  let brand
  try {
    brand = await Brand.findById(req.params.id)
    if (brand == null) {
      return res.status(404).json({ message: 'Cannot find brand' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.brand = brand
  next()
}

// Getting One
router.get('/:id', getBrand, (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.json(res.brand)
})

// Creating one
router.post('/', async (req, res) => {
  const brand = new Brand({
    name: req.body.name,
    clothingType: req.body.clothingType,
    creator: req.body.creator
  })
  try {
    const newBrand = await brand.save()
    res.status(201).json(newBrand)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Updating One
router.put('/:id', getBrand, async (req, res) => {
  if (req.body.name != null) {
    res.brand.name = req.body.name
  }
  if (req.body.clothingType != null) {
    res.brand.clothingType = req.body.clothingType
  }
  if (req.body.creator != null) {
    res.brand.creator = req.body.creator
  }
  try {
    const updatedBrand = await res.brand.save()
    res.json(updatedBrand)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting One
router.delete('/:id', getBrand, async (req, res) => {
  try {
    await res.brand.remove()
    res.status(204).json({ message: 'Deleted brand' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// function formatCollection(req, results, total) {
//   let newResults = [];
//   for (let result of results) {
//     let n = result.toObject();
//     n._links = {
//       self: {
//         href: req.protocol + '://' + req.get('host') + req.originalUrl + '/' + n._id
//       },
//       collection: {
//         href: req.protocol + '://' + req.get('host') + req.originalUrl
//       }
//     }
//     newResults.push(n)
//   }
  
//   var limit = parseInt(req.params.limit)
//   var start = parseInt(req.params.start)
//   return newResults
// }

// Retrieve options for brand resource
router.options('/', async (req, res) => {
  let headers = [];

  headers['Access-Control-Allow-Origin'] = '*';
  headers['Content-Type'] = 'Content-Type', 'application/json';
  headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
  headers['Allow'] = 'GET, POST, OPTIONS';
  headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
  headers['Content-Length'] = '0';
  headers["Access-Control-Max-Age"] = '86400';

  res.writeHead(200, headers);
  res.send();
});

// Retrieve options for brands detail resource
router.options('/:id', function (req, res) {
  let headers = [];

  headers['Access-Control-Allow-Origin'] = '*';
  headers['Content-Type'] = 'Content-Type', 'text/html; charset=UTF-8';
  headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
  headers['Allow'] = 'GET, PUT, DELETE, OPTIONS';
  headers['Access-Control-Allow-Methods'] = 'GET, PUT, DELETE, OPTIONS';
  headers['Content-Length'] = '0';
  headers["Access-Control-Max-Age"] = '86400';

  res.writeHead(200, headers);
  res.send();
})

module.exports = router