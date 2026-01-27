import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Grid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useToast,
  SimpleGrid,
  VStack,
  HStack,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Text,
  InputGroup,
  Stack,
} from "@chakra-ui/react";
import PetCardShelter from "../components/PetCardShelter";
import HeaderShelter from "../components/HeaderShelter";
import PetFormField from "../components/PetFormField"; // Import reusable form field component

const ShelterDashboard = () => {
  const initialPetState = {
    shelterId: "",
    types: "",
    breed: "",
    color: "",
    age: "",
    gender: "",
    adoptionFee: "",
    availability: "",
    sizePreference: "",
    exerciseAmount: "",
    homeFrequency: "",
    otherPets: "",
    specialCareNeed: "",
    petAgePreference: "",
    imageUrl: "", // For storing the image URL
    imageBlob: null, // For storing the uploaded image as a file
  };

  const shelterId = localStorage.getItem("shelterId");

  const [pets, setPets] = useState([]);
  const [newPet, setNewPet] = useState(initialPetState);
  const [editPet, setEditPet] = useState(null); // State for the pet being edited
  const { isOpen, onOpen, onClose } = useDisclosure(); // For Add Pet modal
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure(); // For Edit Pet modal
  const toast = useToast();
  // Field configuration array
  const petFields = [
    {
      key: "types",
      label: "What type of a pet is it?",
      options: ["Dog", "Cat", "Bird", "Rabbits", "Fish"],
    },
    { key: "breed", label: "What breed is the pet?" },
    {
      key: "color",
      label: "What color is the pet?",
      options: ["Black", "White", "Brown", "Mixed", "Other"],
    },
    { key: "age", label: "What is the age of the pet?" },
    {
      key: "gender",
      label: "What gender is the pet?",
      options: ["Male", "Female"],
    },
    { key: "adoptionFee", label: "What is the adoption fee?" },
    { key: "availability", label: "Availability", options: ["true", "false"] },
    {
      key: "sizePreference",
      label: "What size is the pet?",
      options: ["Small", "Medium", "Large"],
    },
    {
      key: "exerciseAmount",
      label: "How much daily exercise does the pet need?",
      options: ["Little to none", "30 minutes", "1 hour", "More than an hour"],
    },
    {
      key: "homeFrequency",
      label: "How often does the pet need the owner to be around?",
      options: ["Rarely", "Sometimes", "Often", "Always"],
    },
    {
      key: "otherPets",
      label: "How many other pets is okay for the pet to be around?",
      options: ["No other pets", "Does not matter"],
    },
    {
      key: "specialCareNeed",
      label: "Does the pet need special care?",
      options: ["Yes", "No", "Not sure"],
    },
    {
      key: "petAgePreference",
      label: "What is the age range of the pet?",
      options: ["Puppy/kitten", "Young", "Adult", "Senior"],
    },
  ];

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/shelters/${shelterId}/pets`
        );
        const petsWithBlobs = response.data.map((pet) => {
          // Convert blob into an Object URL
          if (pet.imageBlob) {
            const blobUrl = URL.createObjectURL(new Blob([pet.imageBlob]));
            return { ...pet, imageBlob: blobUrl };
          }
          return pet;
        });
        setPets(petsWithBlobs);
      } catch (error) {
        toast({
          title: "Error fetching pets.",
          description:
            "There was an error fetching the pets. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchPets();
  }, [shelterId, toast]); // Add shelterId as a dependency

  const handleAddPet = async () => {
    try {
      const formData = new FormData();

      // Append all form fields excluding shelterId and image-related fields
      Object.entries(newPet).forEach(([key, value]) => {
        if (key !== "shelterId" && key !== "imageBlob" && key !== "imageUrl") {
          formData.append(key, value);
        }
      });

      // Manually append shelterId
      formData.append("shelterId", shelterId);

      // Append either imageBlob or imageUrl, but not both
      if (newPet.imageBlob) {
        formData.append("imageBlob", newPet.imageBlob); // Handle file upload
      } else if (newPet.imageUrl) {
        formData.append("imageUrl", newPet.imageUrl.trim()); // Ensure imageUrl is a string
      }

      console.log("FormData contents before sending:", formData);

      const response = await axios.post(
        "http://localhost:5001/api/pets",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      let createdPet = response.data;

      // Fetch the new image if imageBlob was provided
      if (newPet.imageBlob) {
        const imageResponse = await axios.get(
          `http://localhost:5001/api/pets/${createdPet.id}/image`,
          { responseType: "blob" }
        );
        const blobUrl = URL.createObjectURL(imageResponse.data);
        createdPet = { ...createdPet, imageBlob: blobUrl }; // Assign the new blob URL
      }

      console.log("Created pet:", createdPet);

      setPets([...pets, createdPet]);
      setNewPet(initialPetState);
      onClose();

      toast({
        title: "Pet added.",
        description: "The pet has been added successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding pet:", error);
      toast({
        title: "Error adding pet.",
        description: "There was an error adding the pet. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdatePet = async () => {
    try {
      const formData = new FormData();

      // Append all form fields excluding shelterId
      Object.entries(editPet).forEach(([key, value]) => {
        if (key !== "shelterId" && key !== "imageBlob" && key !== "imageUrl") {
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        }
      });

      // Manually append shelterId
      formData.append("shelterId", shelterId);

      // Append interestedUsers
      const interestedUsers = editPet.interestedUsers || [];
      formData.append(
        "interestedUsers",
        JSON.stringify(
          interestedUsers
            .map((value) => {
              const parsed = parseInt(value, 10);
              return isNaN(parsed) ? null : parsed;
            })
            .filter((value) => value !== null)
        )
      );

      // Handle switching between imageBlob and imageUrl
      if (editPet.imageBlob) {
        formData.append("imageBlob", editPet.imageBlob); // If imageBlob is provided
        formData.append("imageUrl", ""); // Clear imageUrl
      } else if (editPet.imageUrl) {
        formData.append("imageUrl", editPet.imageUrl); // If imageUrl is provided
        formData.append("imageBlob", ""); // Clear imageBlob
      }

      // Debugging: Log FormData
      console.log("FormData contents:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.put(
        `http://localhost:5001/api/pets/${editPet.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      let updatedPet = response.data;

      // Update the pet immediately in the frontend
      if (editPet.imageBlob) {
        const imageResponse = await axios.get(
          `http://localhost:5001/api/pets/${updatedPet.id}/image`,
          { responseType: "blob" }
        );
        const blobUrl = URL.createObjectURL(imageResponse.data);
        updatedPet = { ...updatedPet, imageBlob: blobUrl }; // Assign the new blob URL
      }

      setPets(pets.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet)));
      setEditPet(null);

      toast({
        title: "Pet updated.",
        description: "The pet has been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onEditClose();
    } catch (error) {
      console.error("Error updating pet:", error);
      toast({
        title: "Error updating pet.",
        description: "There was an error updating the pet. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeletePet = async (petId) => {
    try {
      await axios.delete(`http://localhost:5001/api/pets/${petId}`);
      setPets(pets.filter((pet) => pet.id !== petId));
      toast({
        title: "Pet deleted.",
        description: "The pet has been deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting pet.",
        description: "There was an error deleting the pet. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const renderFormFields = (pet, setPet) => {
    // Ensure default input method is set
    if (!pet.inputMethod) {
      setPet({ ...pet, inputMethod: "url" }); // Default to "url"
    }

    return (
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {petFields.map((field) => (
          <PetFormField
            key={field.key}
            label={field.label}
            value={pet[field.key]}
            onChange={(e) => setPet({ ...pet, [field.key]: e.target.value })}
            options={field.options}
          />
        ))}
        <Box gridColumn="span 2">
          <VStack align="stretch" spacing={6}>
            <FormControl>
              <FormLabel fontWeight="semibold" color="teal.600">
                Select Image Input Method
              </FormLabel>
              <RadioGroup
                onChange={(value) =>
                  setPet((prev) => ({
                    ...prev,
                    inputMethod: value,
                    imageUrl: value === "url" ? prev.imageUrl : "",
                    imageBlob: value === "upload" ? prev.imageBlob : null,
                  }))
                }
                value={pet.inputMethod || "url"} // Default to "url"
                colorScheme="teal"
              >
                <Stack direction="row">
                  <Radio value="url">URL</Radio>
                  <Radio value="upload">File Upload</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {/* Image URL Input */}
            <FormControl isDisabled={pet.inputMethod !== "url"}>
              <FormLabel
                fontWeight="semibold"
                color={pet.inputMethod === "url" ? "teal.600" : "gray.400"}
              >
                Image URL
              </FormLabel>
              <Input
                placeholder="Paste the image URL of the pet"
                value={pet.imageUrl}
                onChange={(e) => setPet({ ...pet, imageUrl: e.target.value })}
                focusBorderColor={
                  pet.inputMethod === "url" ? "teal.400" : "gray.200"
                }
                bg="gray.50"
                borderRadius="md"
                boxShadow="sm"
                isDisabled={pet.inputMethod !== "url"}
              />
              <Text fontSize="sm" color="gray.500" mt={2}>
                Enter a valid URL ending with an image extension (e.g., .jpg,
                .png).
              </Text>
            </FormControl>

            {/* File Upload Input */}
            <FormControl isDisabled={pet.inputMethod !== "upload"}>
              <FormLabel
                fontWeight="semibold"
                color={pet.inputMethod === "upload" ? "teal.600" : "gray.400"}
              >
                Upload Image
              </FormLabel>
              <Input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setPet({ ...pet, imageBlob: file });
                }}
                focusBorderColor={
                  pet.inputMethod === "upload" ? "teal.400" : "gray.200"
                }
                bg="gray.50"
                borderRadius="md"
                boxShadow="sm"
                accept="image/*"
                isDisabled={pet.inputMethod !== "upload"}
              />
              <Text fontSize="sm" color="gray.500" mt={2}>
                Upload an image directly from your device. Supported formats:
                JPG, PNG.
              </Text>
            </FormControl>
          </VStack>
        </Box>
      </SimpleGrid>
    );
  };

  return (
    <Box>
      <HeaderShelter />
      <Box p={8}>
        <Button colorScheme="teal" mb={4} onClick={onOpen}>
          Add Pet
        </Button>
        <Grid templateColumns="repeat(4, 1fr)" gap={6}>
          {pets.map((pet) => (
            <PetCardShelter
              key={pet.id}
              pet={pet}
              onEdit={(pet) => {
                setEditPet({
                  ...pet,
                  inputMethod: pet.imageBlob ? "upload" : "url", // Default input method based on existing image
                });
                onEditOpen();
              }}
              onDelete={handleDeletePet}
            />
          ))}
        </Grid>

        {/* Add Pet Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Pet</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{renderFormFields(newPet, setNewPet)}</ModalBody>
            <ModalFooter>
              <Button colorScheme="gray" onClick={onClose} mr={3}>
                Cancel
              </Button>
              <Button colorScheme="pink" onClick={handleAddPet}>
                Add Pet
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Edit Pet Modal */}
        {editPet && (
          <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Pet</ModalHeader>
              <ModalCloseButton />
              <ModalBody>{renderFormFields(editPet, setEditPet)}</ModalBody>
              <ModalFooter>
                <Button colorScheme="gray" onClick={onEditClose} mr={3}>
                  Cancel
                </Button>
                <Button colorScheme="pink" onClick={handleUpdatePet}>
                  Update Pet
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Box>
    </Box>
  );
};

export default ShelterDashboard;
