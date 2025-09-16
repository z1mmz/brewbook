const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    recipe: {
        type: String,
        required: true
    },
    reviews:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        required: true
    }
})

const Recipe = mongoose.model('Recipe', reviewSchema)

module.exports = Recipe