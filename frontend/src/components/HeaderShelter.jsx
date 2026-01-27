// src/components/HeaderShelter.jsx

import React, { useEffect, useState } from "react";
import { Flex, Button, Box, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HeaderShelter = () => {
  const navigate = useNavigate();
  const [shelterName, setShelterName] = useState("Shelter");

  const shelterId = localStorage.getItem("shelterId");

  const handleLogout = () => {
    // Handle logout by clearing token and navigating to login
    localStorage.removeItem("token");
    localStorage.removeItem("shelterId");
    navigate("/shelter-login");
  };

  useEffect(() => {
    // Fetch shelter name using shelterId
    const fetchShelterName = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/shelters/${shelterId}`);
        setShelterName(response.data.name);
      } catch (error) {
        console.error("Failed to fetch shelter name:", error);
      }
    };

    if (shelterId) {
      fetchShelterName();
    }
  }, [shelterId]);

  return (
    <Flex
      as="header"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      p={4}
      justifyContent="space-between"
      alignItems="center"
    >
      <Box
        fontWeight="bold"
        fontSize="24px"
        color="#120e2f"
        onClick={() => navigate("/shelter-dashboard")}
        cursor="pointer"
      >
        Shelter Dashboard
      </Box>
      <Text fontSize="xl" fontWeight="bold" color="gray.400">
        Hello, {shelterName}
      </Text>
      <Flex gap={4}>
        <Button colorScheme="teal" onClick={() => navigate("/manage-adoptions")}>
          Manage Adoptions
        </Button>
        <Button colorScheme="pink" onClick={handleLogout}>
          Logout
        </Button>
      </Flex>
    </Flex>
  );
};

export default HeaderShelter;