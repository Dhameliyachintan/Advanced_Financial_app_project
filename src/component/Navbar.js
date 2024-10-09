import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "./form/Authprovider";
import styled from "styled-components";

const NavbarContainer = styled.nav`
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const NavContent = styled.div`
  max-width: 1280px; 
  margin: 0 auto;
  padding: 0 1rem; 
  
  @media (min-width: 640px) {
    padding: 0 1.5rem; 
  }
  @media (min-width: 1024px) {
    padding: 0 2rem; 
  }
`;

const NavFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem; 
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.25rem; 
  font-weight: bold;
  color: black;
  text-decoration: none;
`;

const NavLink = styled(Link)`
  margin-left: 1rem; 
  padding: 0.5rem 1rem; 
  font-size: 0.875rem; 
  font-weight: 500; 
  color: black;
  border-radius: 0.375rem; 
  text-decoration: none;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const LogoutButton = styled.button`
  margin-left: 1rem; 
  padding: 0.5rem 1rem; 
  font-size: 0.875rem; 
  font-weight: 500; 
  color: black;
  border-radius: 0.375rem; 
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Successfully logged out!");
  };

  return (
    <NavbarContainer>
      <NavContent>
        <NavFlex>
          <Brand to="/">Financial Tracker</Brand>
          <div>
            <NavLink to="/financialForm">Financial Form</NavLink>
            {!isLoggedIn ? (
              <NavLink to="/login">Login</NavLink>
            ) : (
              <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            )}
          </div>
        </NavFlex>
      </NavContent>
    </NavbarContainer>
  );
};

export default Navbar;
