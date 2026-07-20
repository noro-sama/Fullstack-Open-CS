/* eslint-disable no-prototype-builtins */
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const helper = require('./blog_api_helper')

const api = supertest(app)

describe('when there are already existing blogs', () => {
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

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map((b) => b.title)
    assert(titles.includes('Sunny Times'))
  })

  describe('viewing a specific blog', () => {
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

    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api.get(`/api/blogs/${invalidId}`).expect(400)
    })
  })

  describe('addition of a new note', () => {
    test('blogs length is increased by one', async () => {
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

    test('blog without likes defaults to zero', async () => {
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

    test('blog without url or title is invalid and not added', async () => {
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
  })

  describe('updating of a blog', () => {
    test('succeeds with status code 200 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const likesBefore = blogsAtStart[0].likes
      const id = blogToUpdate.id
      const blog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 35,
      }

      await api.put(`/api/blogs/${id}`).send(blog).expect(200)
      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find((b) => b.id === id)

      assert.notStrictEqual(likesBefore, updatedBlog.likes)
      assert.strictEqual(updatedBlog.likes, 35)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()
      const blog = {
        author: 'New Author',
        url: 'http://test.com/nb',
        title: 'some title',
        likes: 35,
      }

      await api.put(`/api/blogs/${validNonexistingId}`).send(blog).expect(404)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map((n) => n.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })
})
