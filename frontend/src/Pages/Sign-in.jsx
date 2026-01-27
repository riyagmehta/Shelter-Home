import React, { useState, useRef } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link,
  Alert,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import axios from "axios";
import { Global } from "@emotion/react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const cancelRef = useRef();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
  };

  const validate = () => {
    const errors = {};

    if (!formData.name) {
      errors.name = "Name is required.";
    }

    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format.";
    }

    if (!formData.username) {
      errors.username = "Username is required.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setError(errors);

    return Object.keys(errors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const { username, email, password } = formData;

    try {
      const response = await axios.post("http://localhost:5001/api/signup", {
        username,
        email,
        password,
      });

      localStorage.setItem('token', response.data.token); // Store the token in local storage
      localStorage.setItem('userId', response.data.id); // Correct key for user ID from the response
      localStorage.setItem('username', response.data.username); // Save the username
      setMessage("Sign up was successful! Redirecting to the quiz...");
      setError({});

      setTimeout(() => {
        navigate(`/quiz`, { state: { userId: response.data.id } }); // Correctly passing userId to Dashboard
      }, 1500);
    } catch (err) {
      const errorResponse = err.response || {};
      if (errorResponse.status === 400) {
        setError({ general: "User already exists." });
        setIsPopupOpen(true);
      } else {
        setError({ general: "Sign up failed. Please try again." });
      }
      setMessage("");
    }
  };


  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const commonBoxShadow = "0 2px 4px rgba(0, 0, 0, 0.4)";
  const commonBorderRadius = "25px";
  const commonInputStyles = {
    boxShadow: commonBoxShadow,
    borderColor: "grey",
    padding: "3%",
    borderRadius: commonBorderRadius,
    width: "100%",
    fontSize: "12px",
    boxSizing: "border-box",
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
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding="0"
        margin="0"
        color={"#120e2f"}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          maxWidth="400px"
        >
          <Text fontSize="50px" fontWeight="700" mb={0}>
            Hello there!
          </Text>
          <Text fontSize="12px" fontWeight="500" mb={"10%"}>
            Provide your information to get started
          </Text>

          {error.general && <Alert status="error">{error.general}</Alert>}
          {message && <Alert status="success">{message}</Alert>}

          <FormControl width="100%" mb={"5%"}>
            <FormLabel ml={"2%"} mb={"2%"} fontSize="15px" fontWeight="600">
              Name
              <Text as="sup" color="red">
                *
              </Text>
            </FormLabel>
            <Input
              {...commonInputStyles}
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
            {error.name && (
              <Text fontSize="15px" color="red">
                {error.name}
              </Text>
            )}
          </FormControl>

          <FormControl width="100%" mb={"5%"}>
            <FormLabel ml={"2%"} mb={"2%"} fontSize="15px" fontWeight="600">
              Email
              <Text as="sup" color="red">
                *
              </Text>
            </FormLabel>
            <Input
              {...commonInputStyles}
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {error.email && (
              <Text fontSize="15px" color="red">
                {error.email}
              </Text>
            )}
          </FormControl>

          <FormControl width="100%" mb={"5%"}>
            <FormLabel ml={"2%"} mb={"2%"} fontSize="15px" fontWeight="600">
              Username
              <Text as="sup" color="red">
                *
              </Text>
            </FormLabel>
            <Input
              {...commonInputStyles}
              type="text"
              name="username"
              placeholder="Choose a unique username"
              value={formData.username}
              onChange={handleChange}
            />
            {error.username && (
              <Text fontSize="15px" color="red">
                {error.username}
              </Text>
            )}
          </FormControl>

          <FormControl width="100%" mb={"5%"}>
            <FormLabel ml={"2%"} mb={"2%"} fontSize="15px" fontWeight="600">
              Password
              <Text as="sup" color="red">
                *
              </Text>
            </FormLabel>
            <Input
              {...commonInputStyles}
              type="password"
              name="password"
              placeholder="Set a secure password"
              value={formData.password}
              onChange={handleChange}
            />
            {error.password && (
              <Text fontSize="15px" color="red">
                {error.password}
              </Text>
            )}
          </FormControl>

          <FormControl width="100%" mb={"5%"}>
            <FormLabel ml={"2%"} mb={"2%"} fontSize="15px" fontWeight="600">
              Confirm Password
              <Text as="sup" color="red">
                *
              </Text>
            </FormLabel>
            <Input
              {...commonInputStyles}
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {error.confirmPassword && (
              <Text fontSize="15px" color="red">
                {error.confirmPassword}
              </Text>
            )}
          </FormControl>

          <Button
            marginTop={"1%"}
            boxShadow={commonBoxShadow}
            backgroundColor="pink"
            borderRadius={commonBorderRadius}
            padding="3%"
            fontSize="15px"
            fontWeight="600"
            width="90%"
            boxSizing="border-box"
            mb="2%"
            onClick={handleSubmit}
            _hover={{ backgroundColor: "#120e2f", color: "white" }}
          >
            Join Now
          </Button>

          <Link
            fontSize="12px"
            textAlign="center"
            color={"#120e2f"}
            _hover={{ color: "grey" }}
            mt="2%"
            display="block"
            href="/login"
          >
            Already a member? Log in
          </Link>
        </Box>
      </Box>

      <AlertDialog
        isOpen={isPopupOpen}
        leastDestructiveRef={cancelRef}
        onClose={closePopup}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              User Already Exists
            </AlertDialogHeader>

            <AlertDialogBody>
              A user with this email already exists. Please try again with a
              different email.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closePopup}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default SignIn;
