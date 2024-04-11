const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    clothingType: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    }
})

brandSchema.set('toObject', {
    virtuals: true
})

brandSchema.set('toJSON', {
    virtuals: true
})

// Add virtual properties to the model instance.
brandSchema.virtual('_links').get(function() {
    return {
        "self": {
            "href": 'http://145.24.222.99:3000/brands/' + this._id,
        },
        "collection": {
            "href": 'http://145.24.222.99:3000/brands'
        }
    };
});

module.exports = mongoose.model('brand', brandSchema)