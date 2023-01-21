import { useContext } from "react";
import { NavLink } from 'react-router-dom'
import { useLocation } from "react-router-dom";

// Components 
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

// Lib 
import AppContext from "../lib/app-context";

const NavBar = (props) => {
  const { handleLogOut } = useContext(AppContext)
  const isAuthenticated = props.isAuthenticated
  let location = useLocation().pathname

  if (location === '/login' || location === '/sign-up' || isAuthenticated === false) {
    return (
      null
    )
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