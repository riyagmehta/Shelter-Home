// src/components/PetCard.jsx

import React from "react";
import {
  GridItem,
  Image,
  Flex,
  Box,
  Text,
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
  Grid,
} from "@chakra-ui/react";
import { FaTrash, FaEdit } from "react-icons/fa"; // Importing icons for delete and edit actions

const PetCardShelter = ({ pet, onEdit, onDelete }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = () => {
    onDelete(pet.id);
  };

  const displayImage = pet.imageBlob
    ? `http://localhost:5001/api/pets/${pet.id}/image` // Replace with your backend's URL structure
    : pet.imageUrl;

  return (
    <>
      <GridItem bg="white" borderRadius="md" boxShadow="lg" p={4}>
        <Image
          src={displayImage}
          alt={pet.types}
          borderRadius="md"
          mb="4"
          objectFit="cover"
          width="100%"
          height="250px"
        />
        <Text fontSize="md" color="gray.600" fontWeight={600}>
          {pet.breed ? pet.breed + " " + pet.types : pet.types}
        </Text>
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <Text fontSize="sm" color="gray.600">
              {pet.gender}, {pet.age} years
            </Text>
            <Button variant="link" fontSize={13} onClick={onOpen}>
              Learn More
            </Button>
          </Box>
          <Flex>
            <IconButton
              icon={<FaEdit />}
              colorScheme="blue"
              onClick={() => onEdit(pet)}
              mr={2}
            />
            <IconButton
              icon={<FaTrash />}
              colorScheme="red"
              onClick={handleDelete}
            />
          </Flex>
        </Flex>
      </GridItem>

      <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{pet.breed || pet.types}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box borderRadius="md" overflow="hidden" boxShadow="lg" mb={6}>
              <Image
                src={displayImage}
                alt={pet.types}
                objectFit="cover"
                width="100%"
                height="250px"
              />
            </Box>


            <Box
              p={4}
              border="1px"
              borderColor="gray.300"
              borderRadius="lg"
              boxShadow="sm"
              bg="gray.50"
              mb={6}
            >
              <Text
                fontSize="2xl"
                fontWeight="semibold"
                mb={4}
                color="teal.500"
              >
                🐾 Details
              </Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <Flex align="center">
                  <Text fontWeight="bold" mr={2}>
                    Type:
                  </Text>
                  <Text>{pet.types}</Text>
                </Flex>
                <Flex align="center">
                  <Text fontWeight="bold" mr={2}>
                    Breed:
                  </Text>
                  <Text>{pet.breed || "N/A"}</Text>
                </Flex>
                <Flex align="center">
                  <Text fontWeight="bold" mr={2}>
                    Gender:
                  </Text>
                  <Text>{pet.gender}</Text>
                </Flex>
                <Flex align="center">
                  <Text fontWeight="bold" mr={2}>
                    Age:
                  </Text>
                  <Text>{pet.age} years</Text>
                </Flex>
                <Flex align="center">
                  <Text fontWeight="bold" mr={2}>
                    Adoption Fee:
                  </Text>
                  <Text>${pet.adoptionFee}</Text>
                </Flex>
              </Grid>
            </Box>

            <Box
              p={4}
              border="1px"
              borderColor="gray.300"
              borderRadius="lg"
              boxShadow="sm"
              bg="gray.50"
              mb={6}
            >
              <Text
                fontSize="2xl"
                fontWeight="semibold"
                mb={4}
                color="teal.500"
              >
                💡 Preferences
              </Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <Flex align="center">
                  <Text fontWeight="bold" mr={2}>
                    Size:
                  </Text>
                  <Text>{pet.sizePreference}</Text>
                </Flex>
                <Flex align="center">
                  <Text fontWeight="bold" mr={2}>
                    Exercise:
                  </Text>
                  <Text>{pet.exerciseAmount}</Text>
                </Flex>
                <Flex align="center">
                  <Text fontWeight="bold" mr={2}>
                    Home Frequency:
                  </Text>
                  <Text>{pet.homeFrequency}</Text>
                </Flex>
                <Flex align="center">
                  <Text fontWeight="bold" mr={2}>
                    Other Pets:
                  </Text>
                  <Text>{pet.otherPets}</Text>
                </Flex>
                <Flex align="center">
                  <Text fontWeight="bold" mr={2}>
                    Special Care:
                  </Text>
                  <Text>{pet.specialCareNeed}</Text>
                </Flex>
              </Grid>
            </Box>

          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PetCardShelter;
