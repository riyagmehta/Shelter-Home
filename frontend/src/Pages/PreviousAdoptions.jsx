import React, { useEffect, useState } from "react";
import Header from "../components/Header";
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
  ButtonGroup,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import PetCardAdoptions from "../components/PetCardAdoptions";
import ChatBox from "../components/ChatBox";

const PreviousAdoptions = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [filter, setFilter] = useState("All");
  const [shelters, setShelters] = useState([]);
  const [currentShelterId, setCurrentShelterId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const userId = location.state?.userId || localStorage.getItem("userId");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/user/${userId}/pets`
        );
        setPets(response.data);
        setFilteredPets(response.data);

        const shelterMap = {};
        response.data.forEach((pet) => {
          if (pet.shelter && pet.shelterId && !shelterMap[pet.shelterId]) {
            shelterMap[pet.shelterId] = pet.shelter.name;
          }
        });
        setShelters(shelterMap);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, [userId]);

  useEffect(() => {
    const filterPets = () => {
      if (filter === "All") {
        setFilteredPets(pets);
      } else if (filter === "Approved") {
        setFilteredPets(
          pets.filter(
            (pet) => !pet.availability && pet.userId === +userId
          )
        );
      } else if (filter === "Approval Pending") {
        setFilteredPets(
          pets.filter(
            (pet) => pet.availability && pet.userId === null
          )
        );
      } else if (filter === "Declined") {
        setFilteredPets(
          pets.filter(
            (pet) => !pet.availability && pet.userId !== null && pet.userId !== +userId
          )
        );
      }
    };

    filterPets();
  }, [filter, pets, userId]);

  const openChat = (shelterId) => {
    setCurrentShelterId(shelterId);
    onOpen();
  };

  return (
    <Box p={8}>
      <Header />
      <Flex m={4}>
        <Box flex="1" p={4} bg="gray.100">
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Chats
          </Text>
          {Object.entries(shelters).map(([shelterId, shelterName]) => (
            <Button key={shelterId} onClick={() => openChat(shelterId)}>
              {shelterName}
            </Button>
          ))}
          <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                Chat with {shelters[currentShelterId]}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <ChatBox
                  senderId={userId}
                  recipientId={currentShelterId}
                  senderType={"user"}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
        <Box flex="3" p={4}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Previous Adoptions
          </Text>
          {/* Filter Buttons */}
          <ButtonGroup mb={4} spacing={4}>
            {["All", "Approved", "Approval Pending", "Declined"].map((status) => (
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
              <PetCardAdoptions key={pet.id} pet={pet} userId={userId} />
            ))}
          </Grid>
        </Box>
      </Flex>
    </Box>
  );
};

export default PreviousAdoptions;
