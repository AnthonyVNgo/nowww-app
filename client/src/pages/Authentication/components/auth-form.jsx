import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Axios 
import Axios from "axios";

// Redux 
import { useSelector, useDispatch } from 'react-redux'
import { setUsername, setPassword, acceptAuth, setAuthInvalidClass, clearAuthInvalidClass } from "../../../state/authentication/authenticationSlice";

function AuthForm() {
  const dispatch = useDispatch()
  const { username, password, authInputClass } = useSelector((store) => store.authentication)

  const handleChange = (event) => {
    const { name, value } = event.target;
    name === 'password' 
      ? dispatch(setPassword(value))
      : dispatch(setUsername(value)); 
  }

  const navigate = useNavigate()

  let location = useLocation().pathname
  let alternateLink = location === '/login' 
    ? '/sign-up' 
    : '/login'

  const handleAltLinkClick = () => {
    navigate(alternateLink)
  }

  useEffect(()=> {
    dispatch(clearAuthInvalidClass())
  }, [location])

  const handleLogIn = (result) => {
    const { token } = result;
    window.localStorage.setItem('react-context-jwt', token);
    dispatch(acceptAuth())
  }

  const authenticateUser = async () => {
    try {
      const res = await Axios.post(`/api${location}`, {username, password});
      const result = res.data;
      if (location === '/sign-up') {
        navigate('/login');
        dispatch(clearAuthInvalidClass())
      } else if (result.user && result.token) {
        handleLogIn(result);
      }
    } catch(error) {
      dispatch(setAuthInvalidClass())
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    authenticateUser()
  }

  const alternateLocationText = location === '/login'
    ? 'Create an account'
    : 'Login instead';
  const submitButtonText = location === '/login'
    ? 'Log In'
    : 'Create';
  const invalidMessage = location === '/login'
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
            className={`form-control bg-light border-0 ${authInputClass}`} 
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
            className={`form-control bg-light border-0 ${authInputClass}`} 
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
              {alternateLocationText}
            </span>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AuthForm