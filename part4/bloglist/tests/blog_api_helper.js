const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialUsers = [
  {
    username: 'test user1',
    name: 'jaylo',
  },
  {
    username: 'test user2',
    name: 'bibi',
  },
]

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

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

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

const populate = async () => {
  const passwordHash = await bcrypt.hash('password', 10)
  const usersWithHash = initialUsers.map((user) => ({
    ...user,
    passwordHash,
  }))

  await User.insertMany(usersWithHash)
  const users = await User.find({})
  const user1 = users.find((u) => u.username === initialUsers[0].username)
  const user2 = users.find((u) => u.username === initialUsers[1].username)
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  populate,
}
