import React, { useState } from "react";
import {
  Box,
  FormControl,
  Image,
  FormLabel,
  Input,
  Button,
  Text,
  Link,
  Alert,
} from "@chakra-ui/react";
import axios from "../utils/axiosConfig";
import { Global } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import login from "../assets/login.png";

const commonBoxShadow = "0 2px 4px rgba(0, 0, 0, 0.4)";
const commonBorderRadius = "25px";
const commonInputStyles = {
  boxShadow: commonBoxShadow,
  padding: "3%",
  borderRadius: commonBorderRadius,
  width: "100%",
  fontSize: "13px",
  boxSizing: "border-box",
};
const commonFormLabelStyles = {
  fontSize: "16px",
  fontWeight: "600",
  mb: "2%",
  ml: "2%",
};

const errorStyles = {
  color: "red",
  fontSize: "14px",
  marginTop: "5px",
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const validate = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid.";
    }
    if (!formData.password) {
      errors.password = "Password is required.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // Ensure the form is valid before submitting

    const { email, password } = formData;
    try {
      const response = await axios.post("http://localhost:5001/api/login", {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token); // Store the token in local storage
      localStorage.setItem('userId', response.data.id); // Store the user ID in local storage
      localStorage.setItem('username', response.data.username); // Save the username
      setMessage("Login successful! Redirecting...");
      setError("");

      // Pass the userId when navigating to the dashboard
      setTimeout(() => {
        navigate("/dashboard", { state: { userId: response.data.id } });  // Correctly passing userId to Dashboard
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Invalid credentials.");
      setMessage("");
    }
  };


  return (
    <>
      <Global
        styles={`
                html, body, #root {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                }
            `}
      />
      <Box
        color={"#120e2f"}
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding="0"
        margin="0"
      >
        <Box
          flex="1"
          backgroundColor="pink"
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          boxSizing="border-box"
        >
          <Box textAlign="center">
            <Image src={login} />
            <Text fontSize="40px" fontWeight="600" mt={0} mb={0}>
              Find your perfect match.
            </Text>
            <Text fontSize="21px" fontWeight="500">
              Discover pets based on your preferences.
            </Text>
          </Box>
        </Box>
        <Box
          flex="1"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box width="100%" maxWidth="400px">
            <Text fontSize="50px" fontWeight="600" mb={"10%"}>
              Hello there!
            </Text>

            {error && <Alert status="error" mb="4%">{error}</Alert>}
            {message && <Alert status="success" mb="4%">{message}</Alert>}

            <FormControl mb={"5%"}>
              <FormLabel {...commonFormLabelStyles}>
                Username or Email <Text as="sup" color="red">*</Text>
              </FormLabel>
              <Input
                {...commonInputStyles}
                type="email"
                name="email"
                placeholder="Enter your username or email"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && <Text style={errorStyles}>{formErrors.email}</Text>}
            </FormControl>

            <FormControl mb={"5%"}>
              <FormLabel {...commonFormLabelStyles}>
                Password <Text as="sup" color="red">*</Text>
              </FormLabel>
              <Input
                {...commonInputStyles}
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              {formErrors.password && <Text style={errorStyles}>{formErrors.password}</Text>}
            </FormControl>

            <Box width="100%" mt="10%" boxSizing="border-box">
              <Button
                fontWeight="600"
                boxShadow={commonBoxShadow}
                backgroundColor="#120e2f"
                borderRadius={commonBorderRadius}
                padding="3%"
                fontSize="15px"
                width="100%"
                color={"white"}
                boxSizing="border-box"
                mb="4%"
                _hover={{ backgroundColor: "pink", color: "#120e2f" }}
                onClick={handleSubmit}
              >
                Login
              </Button>
              <Link
                textAlign="center"
                display="block"
                color={"#120e2f"}
                fontSize="13px"
                _hover={{ color: "#ff844c" }}
                href="#"
              >
                Forgot your password?
              </Link>
              <Link
                textAlign="center"
                display="block"
                color={"#120e2f"}
                fontSize="13px"
                _hover={{ color: "#ff844c" }}
                href="/signin"
              >
                Don't have an account? Sign up!
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Login;
