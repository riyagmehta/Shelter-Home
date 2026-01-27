import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  VStack,
  Alert,
  AlertIcon,
  useColorModeValue,
} from '@chakra-ui/react';

const ShelterLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/shelters/login', {
        email,
        password
      });
  
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('shelterId', response.data.shelter.id); // Store shelterId
      navigate('/shelter-dashboard');
    } catch (error) {
      setError('Invalid credential. Please try again.');
    }
  };

  return (
    <Container maxW="md" centerContent>
      <Box
        p={8}
        mt={8}
        borderWidth={1}
        borderRadius="lg"
        shadow="lg"
        backgroundColor={useColorModeValue("white", "gray.700")}
        width="100%"
      >
        <Heading as="h2" size="xl" textAlign="center" mb={6}>
          Shelter Login
        </Heading>

        {error && (
          <Alert status="error" mb={6}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <VStack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="pink"
              width="full"
              size="lg"
              mt={4}
            >
              Login
            </Button>
          </VStack>
        </form>

        <Text fontSize="sm" mt={4} color="gray.500" textAlign="center">
          Welcome back! Please log in to manage your shelter's pets.
        </Text>
      </Box>
    </Container>
  );
};

export default ShelterLogin;