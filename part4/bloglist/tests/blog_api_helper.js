const blog = require('../models/blog')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialUsers = [
  {
    username: 'test user1',
    name: 'jay lopez',
    password: 'password',
  },
  {
    username: 'test user2',
    name: 'bibi rhexa',
    password: 'secret',
  },
]

const SALT_ROUNDS = 1

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
  const usersToInsert = await Promise.all(
    initialUsers.map(async (u) => ({
      username: u.username,
      name: u.name,
      passwordHash: await bcrypt.hash(u.password, SALT_ROUNDS),
    })),
  )

  const insertedUsers = await User.insertMany(usersToInsert)

  const user1 = insertedUsers.find((u) => u.username === 'test user1')
  const user2 = insertedUsers.find((u) => u.username === 'test user2')

  const blogsToInsert = [
    {
      title: 'Sunny Times',
      author: 'Bertha Haantinga',
      url: 'example.com/blog/sunnl',
      likes: 5,
      user: user1._id,
    },
    {
      title: 'How to cook oxtail',
      author: 'Teddy Mumbi',
      url: 'example.com/blog/oxct',
      likes: 49,
      user: user2._id,
    },
  ]

  const insertedBlogs = await Blog.insertMany(blogsToInsert)

  await User.findByIdAndUpdate(user1._id, {
    $push: { blogs: insertedBlogs[0]._id },
  })
  await User.findByIdAndUpdate(user2._id, {
    $push: { blogs: insertedBlogs[1]._id },
  })
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  populate,
}
