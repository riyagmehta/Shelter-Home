import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate along with useLocation
import Header from "../components/Header";

const AdoptionForm = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { petId, userId } = location.state;
  const [pet, setPet] = useState(null);
  const [formData, setFormData] = useState({
    userId: userId.userId || "",
    name: "",
    email: "",
    phone: "",
    petType: "",
    breedPreference: "",
    reasonForAdoption: "",
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Fetch pet details
    const fetchPet = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/pets/${petId}`
        );
        setPet(response.data);
        setFormData((f) => ({
          ...f,
          petType: response.data.types,
          breedPreference: response.data.breed,
        }));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load pet data.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    // Fetch user details to auto-fill form
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/users/${userId.userId}`
        );
        const { username, email } = response.data;
        setFormData((f) => ({
          ...f,
          name: username || "",
          email: email || "",
        }));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user data.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchPet();
    fetchUserDetails();
  }, [petId, userId, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Submit the adoption form data
      const response = await axios.post(
        `http://localhost:5001/api/adoption-applications/${petId}`,
        formData
      );

      if (response.status === 201) {
        // After successful form submission, update the pet's userId
        const updateResponse = await axios.put(
          `http://localhost:5001/api/pets/${petId}/request-adopt`,
          { userId: userId.userId }
        );

        if (updateResponse.status === 200) {
          toast({
            title: "Adoption processed.",
            description:
              "The adoption request has been processed successfully and the pet's record has been updated.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          // Reset form and navigate back to dashboard
          setFormData({
            userId: "",
            name: "",
            email: "",
            phone: "",
            petType: "",
            breedPreference: "",
            reasonForAdoption: "",
          });
          navigate("/dashboard");
        }
      }
    } catch (error) {
      toast({
        title: "Submission failed.",
        description:
          error.response?.data?.error ||
          "There was an error submitting your request.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!pet) {
    return <Text>Loading pet data or no pet found...</Text>;
  }

  return (
    <Box p={8}>
      <Header />
      <Box p={8} maxWidth="500px" mx="auto">
        <Heading as="h2" size="lg" mb={6}>
          Adopt {pet.breed || pet.types}
        </Heading>
        <Link to="/dashboard">
          <Button size="xs" colorScheme="teal" variant="link" mb={4}>
            Back to Dashboard
          </Button>
        </Link>
        <Text mb={4}>
          You’re applying to adopt{" "}
          {pet.breed ? `${pet.breed} (${pet.types})` : pet.types}.
        </Text>

        <form onSubmit={handleSubmit}>
          <FormControl id="name" isRequired mb={4}>
            <FormLabel>Full Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="email" isRequired mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="phone" isRequired mb={4}>
            <FormLabel>Phone</FormLabel>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="reasonForAdoption" isRequired mb={4}>
            <FormLabel>Reason for Adoption</FormLabel>
            <Textarea
              name="reasonForAdoption"
              value={formData.reasonForAdoption}
              onChange={handleChange}
              placeholder="Share why you'd like to adopt this pet."
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            isLoading={loading}
            loadingText="Submitting"
            width="full"
          >
            Submit Adoption Request
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default AdoptionForm;