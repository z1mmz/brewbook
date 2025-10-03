const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app') 
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { test, after, beforeEach, describe,  } = require('node:test')


const api = supertest(app)

beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('testpassword', 10)
        const user = new User({ username: 'testuser', passwordHash })

        await user.save()
    })

describe('User API', () => {
    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('a valid user can be added', async () => {
        const newUser = {
            username: 'newuser',
            password: 'password123',
            name: 'New User'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await User.find({})
        assert.strictEqual(usersAtEnd.length,2)
        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
       
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const newUser = {
            username: 'testuser',
            password: 'anotherpassword',
            name: 'Duplicate User'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        assert(result.body.error.includes('`username` to be unique'))
    })

    test('passwordHash is not returned in user JSON', async () => {
        const response = await api.get('/api/users')
        response.body.forEach(user => {
            assert.strictEqual(user.passwordHash, undefined)
        })
    })

    test('user object contains id field and not _id or __v', async () => {
        const response = await api.get('/api/users')
        response.body.forEach(user => {
            assert.strictEqual(typeof user.id, 'string')
            assert.strictEqual(user._id, undefined)
            assert.strictEqual(user.__v, undefined)
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})