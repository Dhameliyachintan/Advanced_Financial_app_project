import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7fafc;
  color: #1a202c;
`;

const Card = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: #fff;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  margin-top: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${(props) => (props.$error ? "red" : "#cbd5e0")};
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 1px rgba(66, 153, 225, 0.5);
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.875rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #3182ce;
  color: white;
  font-weight: bold;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  margin-top: 15px;

  &:hover {
    background-color: #2b6cb0;
  }
`;

const SignInLink = styled.button`
  color: #4299e1;
  cursor: pointer;
`;

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    const nameRegex = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (!nameRegex.test(formData.name)) {
      errors.name = "Invalid name format";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      errors.password =
        "Password must be between 6 and 20 characters and contain at least one numeric digit, one uppercase, and one lowercase letter";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    axios
      .post("http://localhost:4000/registration", formData)
      .then((res) => {
        const { access_token } = res.data;
        localStorage.setItem("token", access_token);
        toast.success("Registration successful");
        navigate("/login");
      })
      .catch((err) => {
        alert("Registration failed");
        console.log("Registration error", err);
      });
  };

  return (
    <Container>
      <Card>
        <Title>Registration Form</Title>
        <form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name">Name:</Label>
            <Input
              type="text"
              name="name"
              $error={errors.name}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </div>
          <div>
            <Label htmlFor="email">Email:</Label>
            <Input
              type="email"
              name="email"
              $error={errors.email}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </div>
          <div>
            <Label htmlFor="password">Password:</Label>
            <Input
              type="password"
              name="password"
              $error={errors.password}
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password:</Label>
            <Input
              type="password"
              name="confirmPassword"
              $error={errors.confirmPassword}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
            )}
          </div>
          <SubmitButton type="submit">Submit</SubmitButton>
        </form>
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <p>
            Already have an account?{" "}
            <SignInLink onClick={() => navigate("/login")}>Sign In</SignInLink>
          </p>
        </div>
      </Card>
    </Container>
  );
};

export default Registration;
