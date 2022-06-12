import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import './NavbarFile.css';
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, Link, useHistory } from 'react-router-dom'

function NavLink({ to, ...props}) {
  const history = useHistory();

  return <Nav.Link onClick={() => history.push(to)}>{props.children}</Nav.Link>;
}

function NavbarFile() {
  const history = useHistory();
  const auth0 = useAuth0();
  const { isAuthenticated, logout, loginWithRedirect } = auth0;
  const location = useLocation();

return (
<Navbar className="custom-color" variant="light">
  <Container>
    <Navbar.Brand onClick={() => history.push("/Home")}>The Silk Trade</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
        <NavLink to="/Listings">Top Listings</NavLink>
        { isAuthenticated ?  <NavLink to="/Logging">Active Rentings</NavLink> : null }
        <NavLink to="/About">About Us</NavLink>
      </Nav>
      <Nav className="justify-content-end">
        <NavLink to="/Cart">Cart</NavLink>
        { isAuthenticated ? <NavLink to="/UserProfile">Profile</NavLink> : null }
        
        { isAuthenticated ? 
          <Nav.Link onClick={() => logout({ returnTo: window.location.origin })}>Log Out</Nav.Link> :
          <Nav.Link onClick={() => loginWithRedirect({ appState: { returnTo: location.pathname }})}>Log in</Nav.Link>
        }
        </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>
);
}

export default NavbarFile;