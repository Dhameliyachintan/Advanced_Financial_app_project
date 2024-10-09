import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./Authprovider";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7fafc;
`;

const Card = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding-right: 3.2rem;
`;

const Title = styled.h4`
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${(props) => (props.error ? "red" : "#d1d5db")};
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 1px rgba(66, 153, 225, 0.5);
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.875rem;
  margin-bottom: 15px;
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #3182ce;
  color: white;
  font-weight: bold;
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 15px;

  &:hover {
    background-color: #2b6cb0;
  }
`;

const RegistrationLink = styled.button`
  color: #4299e1;
  cursor: pointer;
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      errors.password =
        "Password must be between 6 and 20 characters and contain at least one numeric digit, one uppercase, and one lowercase letter";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const userdata = {
      email,
      password,
    };

    try {
      const response = await axios.get("http://localhost:4000/registration");
      const users = response.data;

      const user = users.find(
        (user) =>
          user.email === userdata.email && user.password === userdata.password
      );

      if (user) {
        login(user.token);
        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } else {
        toast.error("Invalid email or password");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login Failed";
      toast.error(errorMessage);
      console.log("Login Failed", err);
    }
  };

  return (
    <Container>
      <Card>
        <ToastContainer />
        <Title>Login Page</Title>

        <div>
          <Label>Email</Label>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            error={errors.email}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </div>

        <div>
          <Label>Password</Label>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            error={errors.password}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </div>

        <SubmitButton onClick={handleSubmit}>Login</SubmitButton>

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <p>
            Do not have an account?{" "}
            <RegistrationLink onClick={() => navigate("/registration")}>
              Registration
            </RegistrationLink>
          </p>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
