import axios from 'axios'
const baseUrl = '/api/blogs'

const getToken = () => {
  const storedUser = window.localStorage.getItem('loggedBlogappUser')
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser)
      // Return the token directly, ensuring it exists
      if (user.token) {
        return user.token
      }
    } catch (e) {
      console.error('Error parsing stored user:', e)
    }
  }
  return null
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const deleteItem = async (id) => {
  const token = getToken()

  if (!token) {
    throw new Error('Authentication required. Please log in.')
  }

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

const create = async (newObject) => {
  const token = getToken()

  if (!token) {
    throw new Error('Authentication required. Please log in.')
  }

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const like = async (newObject, id) => {
  const token = getToken()

  if (!token) {
    throw new Error('Authentication required. Please log in.')
  }

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data
}

export default { getAll, create, like, deleteItem }
