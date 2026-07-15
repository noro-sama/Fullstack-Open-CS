/* eslint-disable no-prototype-builtins */
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const helper = require('./blog_api_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  console.log(response.body)
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('the database, by default, names the unique identifier property of the blog posts _id', async () => {
  const list = await Blog.find({})
  const rawDoc = list[0]
  assert.ok(rawDoc._id, 'The database document must have an "_id" property')

  assert.ok(
    rawDoc._id instanceof mongoose.Types.ObjectId,
    true,
    'The "_id" property must be an ObjectId',
  )

  const id = rawDoc._id.toString()
  const res = await api.get(`/api/blogs/${id}`)
  const blog = res.body

  assert.strictEqual(
    blog.id,
    rawDoc._id.toString(),
    'The raw database document "_id" property, is renamed "id" in the returned object',
  )
})

test('a blog is added and the blogs length is increased by one', async () => {
  const blog = {
    title: 'Test DB Structure',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map((r) => r.title)

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  assert(titles.includes('Test DB Structure'))
})

test('blog without likes is added', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'New Author',
    url: 'http://test.com/nb',
  }

  const res = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blog = res.body
  assert.strictEqual(blog.likes, 0)
})

test('blog without url or title is not added', async () => {
  const blogWithMissingTitle = {
    author: 'New Author',
    url: 'http://test.com/nb',
  }
  const blogWithMissingUrl = {
    title: 'New blog',
    author: 'New Author',
  }

  await api.post('/api/blogs').send(blogWithMissingTitle).expect(400)
  await api.post('/api/blogs').send(blogWithMissingUrl).expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})
