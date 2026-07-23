const Blog = ({ blog }) => (
  <div className='blog-entry'>
    <h3>{blog.title}</h3>
    <ul>
      <li>Author: {blog.author}</li>
      <li>Url: {blog.url}</li>
      <li>likes: {blog.likes}</li>
    </ul>
  </div>
)

export default Blog
