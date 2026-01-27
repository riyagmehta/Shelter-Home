import React, { useEffect, useState } from "react";
import HeaderShelter from "../components/HeaderShelter";
import axios from "axios";
import {
  Box,
  Flex,
  Grid,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  ButtonGroup,
} from "@chakra-ui/react";
import PetCardManage from "../components/PetCardManage";
import ChatBox from "../components/ChatBox";

const ManageAdoptions = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [filter, setFilter] = useState("All");
  const [usersDetails, setUsersDetails] = useState(new Map()); // Map to store user details
  const [selectedUser, setSelectedUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const shelterId = localStorage.getItem("shelterId");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/shelter/${shelterId}/pets-with-interests`
        );
        setPets(response.data);
        setFilteredPets(response.data); // Initialize filteredPets to all pets

        const userIds = [];
        response.data.forEach((pet) => {
          pet.interestedUsers.forEach((user) => {
            if (!userIds.includes(user)) userIds.push(user);
          });
        });

        // Fetch user details for each user ID
        const userDetails = await Promise.all(
          userIds.map((id) => fetchUserDetails(id))
        );
        const userDetailsMap = new Map(
          userDetails.map((user) => [user.id, user.username])
        );
        setUsersDetails(userDetailsMap);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, [shelterId]);

  useEffect(() => {
    const filterPets = () => {
      if (filter === "All") {
        setFilteredPets(pets);
      } else if (filter === "Approval Pending") {
        setFilteredPets(
          pets.filter((pet) => pet.availability && pet.interestedUsers.length > 0)
        );
      } else if (filter === "Adopted") {
        setFilteredPets(pets.filter((pet) => !pet.availability));
      }
    };

    filterPets();
  }, [filter, pets]);

  const fetchUserDetails = async (userId) => {
    const response = await axios.get(
      `http://localhost:5001/api/users/${userId}`
    );
    return response.data;
  };

  const handleOpenChat = (userId) => {
    setSelectedUser(userId);
    onOpen();
  };

  return (
    <Box p={0}>
      <HeaderShelter />
      <Flex m={8}>
        <Box flex="1" p={4} bg="gray.100">
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Chats
          </Text>
          <VStack spacing={0} align="start">
            {[...usersDetails].map(([userId, username]) => (
              <Button key={userId} onClick={() => handleOpenChat(userId)}>
                {username}
              </Button>
            ))}
          </VStack>
        </Box>
        <Box flex="3" p={4}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Manage Adoptions
          </Text>
          {/* Filter Buttons */}
          <ButtonGroup mb={4} spacing={4}>
            {["All", "Approval Pending", "Adopted"].map((status) => (
              <Button
                key={status}
                colorScheme={filter === status ? "teal" : "gray"}
                onClick={() => setFilter(status)}
              >
                {status}
              </Button>
            ))}
          </ButtonGroup>
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {filteredPets.map((pet) => (
              <PetCardManage key={pet.id} pet={pet} />
            ))}
          </Grid>
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chat with {usersDetails.get(selectedUser)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ChatBox
              senderId={shelterId}
              recipientId={selectedUser}
              senderType={"shelter"}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ManageAdoptions;