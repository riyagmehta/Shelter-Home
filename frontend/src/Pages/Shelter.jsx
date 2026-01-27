import React, { useState } from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    Select,
    NumberInput,
    NumberInputField,
    Button,
    Box,
    Checkbox,
    useToast,
    Textarea,
    Text
} from '@chakra-ui/react';
import axios from 'axios';

const Shelter = () => {
    const [pet, setPet] = useState({
        types: '', breed: '', color: '', age: 0, gender: '',
        adoptionFee: 0.0, availability: true, sizePreference: '',
        exerciseAmount: '', homeFrequency: '', otherPets: '',
        specialCareNeed: '', petAgePreference: '', image: ''
    });
    const toast = useToast();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPet({ ...pet, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/pets', pet);
            toast({
                title: "Pet has been added",
                description: "A new pet has been added successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            setPet({
                types: '', breed: '', color: '', age: 0, gender: '',
                adoptionFee: 0.0, availability: true, sizePreference: '',
                exerciseAmount: '', homeFrequency: '', otherPets: '',
                specialCareNeed: '', petAgePreference: '', image: ''
            });

        } catch (error) {
            toast({
                title: "Failed to add pet",
                description: error.response.data.error,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box p={5} m={30} shadow="md" borderWidth="1px">
            <Box><Text align="center" fontSize="44" fontWeight={"600"}>Add new pets to the shelter</Text></Box>
            <form onSubmit={handleSubmit}>

                <FormControl isRequired>
                    <FormLabel>Type</FormLabel>
                    <Select name="types" value={pet.types} onChange={handleChange} placeholder="Select type">
                        <option>Dog</option>
                        <option>Cat</option>
                        <option>Bird</option>
                        <option>Rabbits</option>
                        <option>Fish</option>
                    </Select>
                </FormControl>

                <FormControl mt={4}>
                    <FormLabel>Breed</FormLabel>
                    <Input name="breed" value={pet.breed} onChange={handleChange} placeholder="Enter breed (if applicable)" />
                </FormControl>

                <FormControl isRequired mt={4}>
                    <FormLabel>Color</FormLabel>
                    <Select name="color" value={pet.color} onChange={handleChange} placeholder="Select color">
                        <option>Black</option>
                        <option>White</option>
                        <option>Brown</option>
                        <option>Mixed</option>
                        <option>Other</option>
                    </Select>
                </FormControl>

                <FormControl isRequired mt={4}>
                    <FormLabel>Age</FormLabel>
                    <NumberInput min={0} value={pet.age}>
                        <NumberInputField name="age" onChange={handleChange} />
                    </NumberInput>
                </FormControl>

                <FormControl isRequired mt={4}>
                    <FormLabel>Gender</FormLabel>
                    <Select name="gender" value={pet.gender} onChange={handleChange} placeholder="Select gender">
                        <option>Male</option>
                        <option>Female</option>
                    </Select>
                </FormControl>

                <FormControl isRequired mt={4}>
                    <FormLabel>Adoption Fee</FormLabel>
                    <NumberInput precision={2} value={pet.adoptionFee} step={0.1}>
                        <NumberInputField name="adoptionFee" onChange={handleChange} />
                    </NumberInput>
                </FormControl>

                <FormControl isRequired mt={4}>
                    <FormLabel>Availability</FormLabel>
                    <Checkbox name="availability" value={pet.availability} isChecked={pet.availability} onChange={handleChange}>
                        Available for adoption
                    </Checkbox>
                </FormControl>

                <FormControl mt={4}>
                    <FormLabel>Size Preference</FormLabel>
                    <Select name="sizePreference" value={pet.sizePreference} onChange={handleChange} placeholder="Select size (if applicable)">
                        <option>Small</option>
                        <option>Medium</option>
                        <option>Large</option>
                    </Select>
                </FormControl>

                <FormControl mt={4}>
                    <FormLabel>Exercise Amount</FormLabel>
                    <Select name="exerciseAmount" value={pet.exerciseAmount} onChange={handleChange} placeholder="Select exercise amount">
                        <option>Little to none</option>
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>More than an hour</option>
                    </Select>
                </FormControl>

                <FormControl mt={4}>
                    <FormLabel>How often is someone at home?</FormLabel>
                    <Select name="homeFrequency" value={pet.homeFrequency} onChange={handleChange} placeholder="Select home frequency">
                        <option>Rarely</option>
                        <option>Sometimes</option>
                        <option>Often</option>
                        <option>Always</option>
                    </Select>
                </FormControl>

                <FormControl mt={4}>
                    <FormLabel>Other Pets</FormLabel>
                    <Select name="otherPets" value={pet.otherPets} onChange={handleChange} placeholder="Select other pets condition">
                        <option>No other pets</option>
                        <option>Another dog</option>
                        <option>Another cat</option>
                        <option>Multiple pets</option>
                    </Select>
                </FormControl>

                <FormControl mt={4}>
                    <FormLabel>Special Care Need</FormLabel>
                    <Select name="specialCareNeed" value={pet.specialCareNeed} onChange={handleChange} placeholder="Select special care need">
                        <option>No</option>
                        <option>Yes</option>
                        <option>Not Sure</option>
                    </Select>
                </FormControl>

                <FormControl mt={4}>
                    <FormLabel>Pet Age Preference</FormLabel>
                    <Select name="petAgePreference" value={pet.petAgePreference} onChange={handleChange} placeholder="Select pet age preference">
                        <option>Puppy/Kitten</option>
                        <option>Young</option>
                        <option>Adult</option>
                        <option>Senior</option>
                    </Select>
                </FormControl>

                <FormControl mt={4}>
                    <FormLabel>Image URL</FormLabel>
                    <Input name="image" onChange={handleChange} value={pet.image} placeholder="Enter image URL" />
                </FormControl>

                <Button mt={4} backgroundColor={"pink"} color="#120e2f" type="submit">
                    Add Pet
                </Button>
            </form>
        </Box>
    );
}

export default Shelter;
