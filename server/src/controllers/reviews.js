
const reviewsRouter = require('express').Router()
const Review = require('../models/review')
const User = require('../models/user')

reviewsRouter.get('/', async (req, res) => {
    try {
        const allReviews = await Review.find({}).populate('user', { username: 1, name: 1 })
        res.json(allReviews)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' })
    }
})

reviewsRouter.get('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('user', { username: 1, name: 1 })
        if (review) {
            res.json(review)
        } else {
            res.status(404).end()
        }
    } catch (error) {
        res.status(400).json({ error: 'Invalid review ID' })
    }
})

reviewsRouter.post('/', async (req, res) => {
    try {
        const { content, rating, user } = req.body
        const userObj = await User.findById(user)
        if (!userObj) {
            return res.status(400).json({ error: 'User not found' })
        }
        const review = new Review({ content, rating, user })
        const savedReview = await review.save()
        userObj.reviews = userObj.reviews.concat(savedReview._id)
        await userObj.save()
        res.status(201).json(savedReview)
    } catch (error) {
        res.status(400).json({ error: 'Failed to create review' })
    }
})

reviewsRouter.put('/:id', async (req, res) => {
    try {
        const { content, rating } = req.body
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { content, rating },
            { new: true, runValidators: true, context: 'query' }
        )
        if (updatedReview) {
            res.json(updatedReview)
        } else {
            res.status(404).end()
        }
    } catch (error) {
        res.status(400).json({ error: 'Failed to update review' })
    }
})

reviewsRouter.delete('/:id', async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndRemove(req.params.id)
        if (deletedReview) {
            res.status(204).end()
        } else {
            res.status(404).end()
        }
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete review' })
    }
})
module.exports = reviewsRouter