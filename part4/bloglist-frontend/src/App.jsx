import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

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
    blogService
      .getAll()
      .then((blogs) => {
        setBlogs(blogs)
        console.log(blogs)
      })
      .catch((error) => {
        console.error('Failed to fetch blogs:', error)
      })

    const userObjString = window.localStorage.getItem('loggedBlogappUser')
    if (userObjString) {
      try {
        const userObj = JSON.parse(userObjString)
        setUser(userObj)
      } catch (error) {
        console.error('Error parsing user from localStorage:', error)
        window.localStorage.removeItem('loggedBlogappUser')
      }
    }
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

  const handleLikes = async (blog) => {
    const blogId = blog.id

    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    try {
      const updatedBlogResponse = await blogService.like(updatedBlog, blogId)
      if (updatedBlogResponse) {
        setNtype('success')
        setMessage('updated likes')
        setBlogs(blogs.map((b) => (b.id === blogId ? updatedBlogResponse : b)))
      }
    } catch (error) {
      setNtype('error')
      setMessage('couldnt like blog, try again later')
      console.error(error)
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

  const blogsToShow = () => {
    return [...blogs].sort((a, b) => b.likes - a.likes)
  }

  const handleDelete = async (id) => {
    const blog = blogs?.find((b) => b.id === id)
    const userConfirmed = window.confirm(
      `Are you sure you want to remove ${blog.title}? This cannot be undone.`,
    )

    if (userConfirmed) {
      try {
        const res = await blogService.deleteItem(blog.id)
        setNtype('success')
        setMessage(res.message || `Blog ${blog.title} was successfully deleted`)
        const updatedBlogs = await blogService.getAll()
        setBlogs(updatedBlogs)
      } catch (err) {
        setNtype('error')
        setMessage('could not delete blog')
        console.error('Failed to Delete blog', err)
      } finally {
        setTimeout(() => {
          setNtype('')
          setMessage(null)
        }, 5000)
      }
    } else {
      console.log('Deletion canceled by user.')
    }
  }

  return (
    <div>
      <h1>Blog List App</h1>
      <Notification message={message} type={nType} />
      {!user && (
        <Togglable buttonLabel='log in'>
          <LoginForm
            onSubmit={handleLogin}
            username={username}
            password={password}
            onPasswordChange={({ target }) => setPassword(target.value)}
            onUsernameChange={({ target }) => setUsername(target.value)}
          />
        </Togglable>
      )}

      {user && (
        <div>
          <div className='user-dets'>
            <span>
              <p>{user.name} logged in</p>
              <button onClick={handleLogout}>logout</button>
            </span>
          </div>
          <Togglable buttonLabel='add blog'>
            <BlogForm
              onSubmit={addBlog}
              onAuthorChange={({ target }) => setBlogAuthor(target.value)}
              onTitleChange={({ target }) => setBlogTitle(target.value)}
              onUrlChange={({ target }) => setBlogUrl(target.value)}
            />
          </Togglable>
        </div>
      )}
      <div className='blogs-container'>
        <h2>blogs</h2>
        {blogsToShow().map((blog) => (
          <div className='blog-entry' key={blog.id}>
            <Blog
              blog={blog}
              updateLikes={() => {
                handleLikes(blog)
              }}
              removeItem={() => {
                handleDelete(blog.id)
              }}
            />
            {user && blog.user.username === user.username ? (
              <button
                onClick={() => {
                  handleDelete(blog.id)
                }}
              >
                remove
              </button>
            ) : (
              ''
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
