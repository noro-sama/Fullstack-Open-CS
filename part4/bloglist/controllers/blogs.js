/* eslint-disable no-unused-vars */
const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogRouter.post('/', async (request, response, next) => {
  const newBlog = new Blog(request.body)

  newBlog
    .save()
    .then((result) => {
      response.status(201).json(result)
    })
    .catch((error) => {
      next(error)
    })
})

blogRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body
  try {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      response.status(404).end()
    }
    blog.title = title
    blog.author = author
    blog.url = url
    blog.likes = likes

    const updatedBlog = await blog.save()
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter
