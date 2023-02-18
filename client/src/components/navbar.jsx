import { NavLink } from 'react-router-dom'
import { useLocation } from "react-router-dom";

// Redux 
import { useSelector, useDispatch } from 'react-redux'
import { rejectAuth } from "../features/authentication/authenticationSlice"

// Components 
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const NavBar = () => {
  const {isAuthenticated} = useSelector((store) => store.authentication)
  const dispatch = useDispatch()
  
  let location = useLocation().pathname

  const handleLogOut = () => {
    window.localStorage.removeItem('react-context-jwt');
    dispatch(rejectAuth())
  }

  if (location === '/login' || location === '/sign-up' || !isAuthenticated) {
    return null
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <NavLink to='/gallery' className='navbar-brand'>Nowww</NavLink>
          <Nav>
            <NavLink to='/my-profile' className='nav-link'>My Profile</NavLink>
            <NavLink to='/edit-profile' className='nav-link'>Edit Profile</NavLink>
            <span onClick={handleLogOut} className="nav-link" style={{cursor: "pointer"}}>Logout</span>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;