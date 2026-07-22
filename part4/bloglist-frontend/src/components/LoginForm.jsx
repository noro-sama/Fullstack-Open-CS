const LoginForm = ({
  onSubmit,
  username,
  password,
  onPasswordChange,
  onUsernameChange,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>
          username
          <input type='text' value={username} onChange={onUsernameChange} />
        </label>
      </div>
      <div>
        <label>
          password
          <input type='password' value={password} onChange={onPasswordChange} />
        </label>
      </div>
      <button type='submit'>login</button>
    </form>
  )
}

export default LoginForm
