const BlogForm = ({
  onSubmit,
  onTitleChange,
  onAuthorChange,
  onUrlChange,
  author,
  title,
  url,
}) => (
  <form onSubmit={onSubmit}>
    <h2>Add new blog</h2>
    <label>
      title
      <input value={title} onChange={onTitleChange} />
    </label>
    <label>
      author
      <input value={author} onChange={onAuthorChange} />
    </label>
    <label>
      url
      <input value={url} onChange={onUrlChange} />
    </label>
    <button type='submit'>create</button>
  </form>
)

export default BlogForm
