import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

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
    name === 'password' 
      ? setPassword(value)
      : setUsername(value); 
  }

  const handleAltLinkClick = () => {
    navigate(alternateLink)
  }

  const authenticateUser = async () => {
    try {
      const res = await Axios.post(`/api${action}`, {username, password});
      const result = res.data;
      if (action === '/sign-up') {
        navigate('/login');
        setValidLogin('');
      } else if ((action === '/login' && result.error) || (action === '/sign-up' && result.error)) {
        setValidLogin('is-invalid');
      } else if (result.user && result.token) {
        handleLogIn(result);
      }
    } catch(error) {
      console.error(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    authenticateUser()
  }

  const alternatActionText = action === '/login'
    ? 'Create an account'
    : 'Login instead';
  const submitButtonText = action === '/login'
    ? 'Log In'
    : 'Create';
  const invalidMessage = action === '/login'
    ? 'invalid login credentials'
    : 'username already exists'

  return (
    <div className="card border-0">
      <form className="w-100 p-5" onSubmit={handleSubmit}>
        <div className="text-center">
          <h1
           className="mb-3 text-start"
           style={{
            backgroundImage: 'linear-gradient(to right, #0695ff, #a33afa, #ff6968)', 
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text', 
            color: 'transparent',
            fontSize: 'clamp(2rem, 4vw + 1.5rem, 4rem)',
            lineHeight: '.9'
            }}
           >
            Share your current focus
          </h1>
          <p className="text-muted text-start">
            Nowww makes it easy to share what you are focused on now
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
            className={`form-control bg-light border-0 ${isValidLogin}`} 
          />
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
            className="form-control bg-light border-0"
          />
        </div>
        <div className='row'>
          <div>
            <button 
              type="submit" 
              className="btn btn-primary rounded-pill px-3"
            >
              {submitButtonText}
            </button>
            <span 
              onClick={handleAltLinkClick} 
              className="btn btn-link"
            >
              {alternatActionText}
            </span>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AuthForm