import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogTitle, setBlogTitle] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [message, setMessage] = useState(null)
  const [nType, setNtype] = useState('')

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      if (user) {
        setNtype('success')
        setMessage('successfully logged in')
      }
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setNtype('error')
      setMessage('wrong username or password')
    } finally {
      setTimeout(() => {
        setNtype('')
        setMessage(null)
      }, 5000)
    }
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      url: blogUrl,
      author: blogAuthor,
      title: blogTitle,
    }
    try {
      const returnedBlog = await blogService.create(blogObject)
      if (returnedBlog) {
        setNtype('success')
        setMessage(`a new blog ${blogTitle} by ${blogAuthor} is added`)
      }
      setBlogs(blogs.concat(returnedBlog))
      setBlogAuthor('')
      setBlogTitle('')
      setBlogUrl('')
    } catch (error) {
      setNtype('error')
      setMessage('couldnt create blog', error)
    } finally {
      setTimeout(() => {
        setNtype('')
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }
  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setBlogAuthor(event.target.value)
  }
  const handleUrlChange = (event) => {
    setBlogUrl(event.target.value)
  }
  const handleTitleChange = (event) => {
    setBlogTitle(event.target.value)
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} type={nType} />
      {!user && (
        <LoginForm
          onSubmit={handleLogin}
          username={username}
          password={password}
          onPasswordChange={handlePasswordChange}
          onUsernameChange={handleUsernameChange}
        />
      )}

      {user && (
        <div>
          <div className='user-dets'>
            <h2>Create New Entry</h2>
            <span>
              <p>{user.name} logged in</p>
              <button onClick={handleLogout}>logout</button>
            </span>
          </div>
          <BlogForm
            onSubmit={addBlog}
            onAuthorChange={handleAuthorChange}
            onTitleChange={handleTitleChange}
            onUrlChange={handleUrlChange}
          />
        </div>
      )}
      <div className='blogs-container'>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  )
}

export default App
