import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Lib 
import AppContext from "../lib/app-context";

function AuthForm(props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isValidLogin, setValidLogin] = useState('')
  const { handleLogIn} = useContext(AppContext)
  const navigate = useNavigate()
  let action = props.action 
  let alternateLink = action === '/login' ? '/sign-up' : '/login'

  useEffect(()=> {
    setValidLogin('')
  }, [action])

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'password') {
      setPassword(value)
    } else if (name === 'username') {
      setUsername(value);
    }
  }

  const handleAltLinkClick = () => {
    navigate(alternateLink)
  }

  const authenticate = () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, password})
    };
    fetch(`${action}`, options)
      .then(response => response.json())
      .then(result => {
        if (action === '/sign-up' && result.error) {
          setValidLogin('is-invalid')
        } else if (action === '/sign-up') {
          navigate('/login')
          setValidLogin('')
        } else if (action === '/login' && result.error) {
          setValidLogin('is-invalid')
        } else if (result.user && result.token) {
          handleLogIn(result)
        }
      });      
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    authenticate()
  }

  const welcomeMessage = action === '/login'
    ? 'Sign in to continue'
    : 'Create an account';
  const altAction = action === '/login'
    ? 'Not a user?'
    : 'Already a user?';
  const alternatActionText = action === '/login'
    ? 'Create an account'
    : 'Login instead';
  const submitButtonText = action === '/login'
    ? 'Login'
    : 'Create';
  const invalidMessage = action === '/login'
    ? 'invalid login credentials'
    : 'username already exists'

  return (
    <div className="card">
      <form className="w-100 p-5" onSubmit={handleSubmit}>
        <div className="text-center">
          <h2 className="mb-2">
            Nowww
          </h2>
          <p className="text-muted">
            {welcomeMessage}
          </p>
        </div>
        <div>
          <label htmlFor="username" className="form-label"></label>
          <input
            placeholder='Username'
            required
            autoFocus
            id="username"
            type="text"
            name="username"
            onChange={handleChange}
            pattern="[a-zA-Z0-9-]+"
            minLength={8}
            maxLength={32}
            className={`form-control bg-light ${isValidLogin}`} />
          <div id="username" className="invalid-feedback">
            {invalidMessage}
          </div>
        </div>  
        <div className="mb-4">
          <label htmlFor="password" className="form-label"></label>
          <input
            placeholder='Password'
            required
            id="password"
            type="password"
            name="password"
            minLength={8}
            maxLength={32}
            onChange={handleChange}
            className="form-control bg-light" />
        </div>
        <button type="submit" className="btn btn-primary sign-up-btn w-100">
          {submitButtonText}
        </button>
        <div className='row justify-content-center'>
          <p className='text-center my-2'>
            {altAction}
          </p>
          <span onClick={handleAltLinkClick} className="btn btn-link">
            {alternatActionText}
          </span>
        </div>
      </form>
    </div>
  )
}

export default AuthForm