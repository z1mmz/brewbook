
const reviewsRouter = require('express').Router()
const Review = require('../models/review')
const User = require('../models/user')
const Recipe = require('../models/recipe')
const middleware = require('../utils/middleware')

reviewsRouter.get('/', async (req, res) => {
    try {
        const filter = req.query.recipe ? { recipe: req.query.recipe } : {}
        const allReviews = await Review.find(filter).populate('user', { username: 1 })
        res.json(allReviews)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' })
    }
})

reviewsRouter.get('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('user', { username: 1 })
        if (review) {
            res.json(review)
        } else {
            res.status(404).end()
        }
    } catch (error) {
        res.status(400).json({ error: 'Invalid review ID' })
    }
})

reviewsRouter.post('/', middleware.userExtractor, async (req, res) => {
    try {
        const { content, rating, recipe: recipeId } = req.body
        const user = req.user
        if (!user) {
            return res.status(401).json({ error: 'authentication required' })
        }
        const recipe = await Recipe.findById(recipeId)
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' })
        }
        const review = new Review({ content, rating, user: user._id, recipe: recipeId })
        const savedReview = await review.save()
        user.reviews = user.reviews.concat(savedReview._id)
        await user.save()
        recipe.reviews = recipe.reviews.concat(savedReview._id)
        await recipe.save()
        res.status(201).json(savedReview)
    } catch (error) {
        res.status(400).json({ error: 'Failed to create review' })
    }
})

reviewsRouter.put('/:id', middleware.userExtractor, async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ error: 'authentication required' })
        }
        const review = await Review.findById(req.params.id)
        if (!review) {
            return res.status(404).end()
        }
        if (review.user.toString() !== user._id.toString()) {
            return res.status(401).json({ error: 'unauthorized' })
        }
        const { content, rating } = req.body
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { content, rating },
            { new: true, runValidators: true, context: 'query' }
        )
        res.json(updatedReview)
    } catch (error) {
        res.status(400).json({ error: 'Failed to update review' })
    }
})

reviewsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ error: 'authentication required' })
        }
        const review = await Review.findById(req.params.id)
        if (!review) {
            return res.status(404).end()
        }
        if (review.user.toString() !== user._id.toString()) {
            return res.status(401).json({ error: 'unauthorized' })
        }
        await Review.findByIdAndDelete(req.params.id)
        await User.findByIdAndUpdate(user._id, { $pull: { reviews: review._id } })
        await Recipe.findByIdAndUpdate(review.recipe, { $pull: { reviews: review._id } })
        res.status(204).end()
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete review' })
    }
})

module.exports = reviewsRouter
