import React, { useState, useEffect } from "react";
import axios from "axios";
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
  VStack,
  Card,
} from "@chakra-ui/react";

const fetchAdoptionDetails = async (petId) => {
  try {
    const response = await axios.get(
      `http://localhost:5001/api/adoption-applications/pet/${petId}`
    );
    return response.data.adoptionApplications;
  } catch (error) {
    console.error("Failed to fetch adoption details for pet:", error);
    return [];
  }
};

const PetCardManage = ({ pet: initialPet }) => {
  const [pet, setPet] = useState(initialPet);
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [adoptionApplications, setAdoptionApplications] = useState([]);

  useEffect(() => {
    if (initialPet.interestedUsers.length > 0) {
      fetchAdoptionDetails(initialPet.id).then(setAdoptionApplications);
    }
  }, [initialPet]);

  const handleViewApprovalRequestsClick = async () => {
    setApprovalOpen(true);
  };

  const approveAdoption = async (userId) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/pets/${pet.id}/approve-adopt`,
        { userId }
      );
      if (response.status === 200) {
        alert("Adoption approved successfully!");
        setPet({ ...pet, availability: false, interestedUsers: [] });
        setApprovalOpen(false);
      }
    } catch (error) {
      console.error("Failed to approve adoption:", error);
      alert("Failed to approve adoption");
    }
  };

  return (
    <>
      <GridItem bg="white" borderRadius="md" boxShadow="lg" p={4}>
        <Image
          src={pet.imageUrl}
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

        <Flex justifyContent="space-between" mt={2}>
          {pet.availability ? (
            <Button
              fontSize={"md"}
              colorScheme="pink"
              variant={"link"}
              onClick={handleViewApprovalRequestsClick}
              mt="2"
              size="sm"
            >
              View Approval Requests
            </Button>
          ) : (
            <Text mt="auto" color="green" fontWeight="bold">
              Adopted
            </Text>
          )}
        </Flex>
      </GridItem>

      {/* Approval Modal */}
      <Modal
        size={"xl"}
        isOpen={approvalOpen}
        onClose={() => setApprovalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Approve Adoption Requests for {pet.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {adoptionApplications.map((application) => (
              <Card key={application.id} p={4} m={2}>
                <VStack align="start" spacing={2}>
                  <Flex justifyContent="space-between" width="100%">
                    <Box>
                      <Text fontWeight="bold" fontSize={"1.2rem"}>
                        Applicant: {application.name}
                      </Text>
                      <Text>Email: {application.email}</Text>
                      <Text>Phone: {application.phone}</Text>
                      <Text>
                        Reason for Adoption: {application.reasonForAdoption}
                      </Text>
                    </Box>
                    <Button
                      mt={2}
                      colorScheme="teal"
                      onClick={() => approveAdoption(application.userId)}
                    >
                      Approve
                    </Button>
                  </Flex>
                </VStack>
              </Card>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" onClick={() => setApprovalOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PetCardManage;
