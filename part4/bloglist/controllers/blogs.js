const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user

    if (!user) {
      return response.status(401).json({ error: 'userId missing or not valid' })
    }

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      response.status(404).end()
    }
    if (blog.user.toString() === user.toString()) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  },
)

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { author, url, title } = request.body
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'UserId missing or not valid' })
  }

  const newBlog = new Blog({
    author: author,
    url: url,
    title: title,
    user: user,
  })

  const savedBLog = await newBlog.save()
  response.status(201).json(savedBLog)
})

blogRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'userId missing or not valid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    response.status(404).end()
  }

  if (blog.user._id.toString() === user.toString()) {
    const uBlog = {
      title: title,
      author: author,
      url: url,
      likes: likes,
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, uBlog)
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogRouter
