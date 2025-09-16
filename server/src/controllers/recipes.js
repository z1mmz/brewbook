const jwt = require('jsonwebtoken')
const recipeRouter = require('express').Router()
const { default: mongoose } = require('mongoose')
const Recipe = require('../models/recipe')
const User = require('../models/user')
const middleware = require('../utils/middleware')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

recipeRouter.get('/', async(request, response) => {
  const recipies = await Recipe.find({}).populate('user')
  response.json(recipies)
})

recipeRouter.get('/:id', async(request, response) => {
  const id = request.params.id
  const recipe = await Recipe.findById(id)
  response.json(recipe)
})

recipeRouter.post('/',middleware.userExtractor, async(request, response) => {

  const user = request.user
  if (!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }

  const recpie = new Recpie(request.body)
  recpie.user = user.id
  const result = await recpie.save()
  user.recpies = user.recpies.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

recipeRouter.delete('/:id',middleware.userExtractor, async(request, response) => {
  const id = request.params.id
  const recpie = await Recpie.findById(id).populate('user')
  const user = request.user
  if (!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }
  if ( blog.user.id === user.id ){
    await Recpie.findByIdAndDelete(id);
    response.status(204).end()
  }else{
    response.status(401).json({
      error:"unauthorized"
    })
  }

})
module.exports = recipeRouter