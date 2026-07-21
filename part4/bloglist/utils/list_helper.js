var fp = require('lodash/fp')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (list) => {
  if (list.length === 0) return 0
  if (list.length === 1) {
    return list[0].likes
  }
  let likes = 0
  list.forEach((blog) => {
    likes += blog.likes
  })

  return likes
}

const favoriteBlog = (list) => {
  if (list.length === 1) return list[0]
  if (list.length === 0) return 'no blogs yet'

  let mostLikes = 0
  list.forEach((blog) => {
    if (blog.likes > mostLikes) {
      mostLikes = blog.likes
    }
  })

  const mostLiked = list.filter((blog) => blog.likes === mostLikes)
  return mostLiked[0]
}

const mostBlogs = (list) => {
  if (list.length === 1) return { author: list[0].author, blogs: 1 }

  const counts = fp.countBy('author')(list)
  const entries = fp.entries(counts)
  const maxPair = fp.maxBy(fp.prop(1), entries)
  return { author: maxPair[0], blogs: maxPair[1] }
}

const mostLikes = (list) => {
  if (list.length === 1) return { author: list[0].author, likes: list[0].likes }

  const arr = fp.pipe(
    fp.groupBy('author'),
    fp.mapValues(fp.sumBy('likes')),
  )(list)

  const res = fp.maxBy(fp.prop(1))(fp.toPairs(arr))
  return { author: res[0], likes: res[1] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
