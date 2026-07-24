import { useState } from 'react'

const Blog = ({ blog, updateLikes }) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  return (
    <div data-id={blog.id}>
      <span>
        <h4>
          {blog.title} by {blog.author}
        </h4>
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'show'}</button>
      </span>
      <span style={showWhenVisible}>
        <p>Url: {blog.url}</p>
      </span>
      <span style={showWhenVisible}>
        <p>likes: {blog.likes}</p>
        <button onClick={updateLikes}>like</button>
      </span>
    </div>
  )
}

export default Blog
