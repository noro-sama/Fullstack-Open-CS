const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Sunny Times',
    author: 'Bertha Haantinga',
    url: 'example.com/blog/sunnl',
    likes: 5,
    id: '6a573415efe06ef7c896f9f6',
  },
  {
    title: 'How to cook oxtail',
    author: 'Teddy Mumbi',
    url: 'example.com/blog/oxct',
    likes: 49,
    id: '6a5734f0fc7937a9dd91f443',
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'How to crochet  granny square',
    author: 'Tracy muso',
    url: 'example.com/blog/crocht',
    likes: 73,
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
}
