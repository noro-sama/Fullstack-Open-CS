/* eslint-disable no-unused-vars */

const config = require('../utils/config')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = config.MONGODB_URI
console.log('connecting to url')
mongoose
  .connect(url, { family: 4 })
  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDb', error.message)
  })

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    minLength: 2,
    required: true,
  },
  author: {
    type: String,
    minLength: 3,
    required: true,
  },
  url: {
    type: String,
    minLength: 5,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Blog', blogSchema)
