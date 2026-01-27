import React from "react";
import {
  GridItem,
  Image,
  Flex,
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Grid,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const PetCard = ({ pet, userId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!pet) return <Text></Text>; // Add a loading or null state if pet is undefined

  // Use imageBlob URL from backend or imageUrl
  const displayImage = pet.imageBlob
    ? `http://localhost:5001/api/pets/${pet.id}/image`
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
          {pet.breed ? `${pet.breed} ${pet.types}` : pet.types}
        </Text>
        <Text fontSize="sm" color="gray.600">
          {pet.gender}, {pet.age} years
        </Text>
        {pet.shelter && pet.shelter.name ? (
          <Text fontSize="sm" color="gray.500">
            Shelter: {pet.shelter.name}
          </Text>
        ) : (
          <Text fontSize="sm" color="gray.500">
            Shelter: N/A
          </Text>
        )}
        <Text
          fontSize="sm"
          fontWeight={600}
          color={
            !pet.availability && pet.userId === +userId
              ? "green"
              : pet.availability && pet.userId === null
              ? "orange"
              : "red"
          }
        >
          {!pet.availability && pet.userId === +userId
            ? "Approved"
            : pet.availability && pet.userId === null
            ? "Approval Pending"
            : "Declined"}
        </Text>
        <Flex justifyContent="space-between" mt={2}>
          <Box>
            <Button
              colorScheme="teal"
              variant="link"
              fontSize={13}
              onClick={onOpen}
            >
              Learn More
            </Button>
          </Box>
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

            <Text
              fontSize="3xl"
              fontWeight="bold"
              mb={4}
              textAlign="center"
              color="teal.600"
            >
              Meet {pet.name || "The Pet"}
            </Text>

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

            <Box
              p={4}
              bgGradient="linear(to-r, teal.500, blue.500)"
              borderRadius="lg"
              color="white"
              textAlign="center"
              boxShadow="lg"
            >
              <Text fontSize="lg" fontWeight="bold">
                "Adopt happiness — Bring {pet.name || "your new friend"} home
                today!"
              </Text>
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

export default PetCard;
