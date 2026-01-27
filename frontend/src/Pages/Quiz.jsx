import React, { useState, useEffect } from 'react';
import {
  Box, Text, Button, VStack, RadioGroup, Stack, Container, Progress, useColorModeValue, HStack
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

const Quiz = () => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [show, setShow] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userIdFromState = location.state?.userId;
    const storedUserId = localStorage.getItem('userId');
    setUserId(userIdFromState || storedUserId);


    setStep(1);
    setAnswers({}); // Clear previous answers if any
  }, [location.state]);

  const questions = {
    1: "What size of pet are you considering?",
    2: "How much daily exercise can you provide to your pet?",
    3: "How often are you at home?",
    4: "Do you have any other pets?",
    5: "Are you looking for a pet that needs special care?",
    6: "What age group of a pet are you considering?"
  };

  const options = {
    1: ["Small", "Medium", "Large"],
    2: ["Little to none", "30 minutes", "1 hour", "More than an hour"],
    3: ["Rarely", "Sometimes", "Often", "Always"],
    4: ["No other pets", "Another dog", "Another cat", "Multiple pets"],
    5: ["Yes, I'm prepared", "No, I'd prefer not", "Not sure"],
    6: ["Puppy/kitten", "Young", "Adult", "Senior"]
  };

  const handleSubmit = async () => {
    const submissionData = {
      userId: parseInt(userId, 10),
      ...answers
    };

    try {
      const response = await axios.post('http://localhost:5001/api/results', submissionData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting quiz:', error.response ? error.response.data : error.message);
    }
  };

  // Go to the next step
  const nextStep = () => {
    setShow(false);
    setTimeout(() => {
      if (step < Object.keys(questions).length) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
      setShow(true);
    }, 300);
  };

  // Go to the previous step
  const prevStep = () => {
    if (step > 1) {
      setShow(false);
      setTimeout(() => {
        setStep(step - 1);
        setShow(true);
      }, 300);
    }
  };

  // Handle answer selection
  const handleChange = (value) => {
    setAnswers({
      ...answers,
      [step]: value
    });
  };

  return (
    <Box p={8} minH="100vh">
      <Header />
      <Container centerContent p={"2%"} maxW="700px">
        <Progress value={(step / Object.keys(questions).length) * 100} size="xs" colorScheme="pink" />
        <Text fontSize="lg" fontWeight="medium" color="gray.500" mt={2}>
          Step {step}/{Object.keys(questions).length}
        </Text>
        <Text fontSize="3xl" fontWeight="bold" textAlign="center" mt={4} mb={6}>
          {questions[step]}
        </Text>

        <Box
          p={6}
          shadow="md"
          borderWidth="1px"
          borderRadius="lg"
          backgroundColor={useColorModeValue("white", "gray.700")}
          width="100%"
        >
          <VStack spacing={5}>
            <RadioGroup onChange={handleChange} value={answers[step] || ''}>
              <Stack direction="column" spacing={4}>
                {options[step].map((option) => (
                  <Button
                    key={option}
                    backgroundColor={answers[step] === option ? "pink.400" : "white"}
                    color={answers[step] === option ? "white" : "gray.700"}
                    border="1px"
                    borderColor="pink.400"
                    width="100%"
                    fontSize="lg"
                    p={6}
                    borderRadius="lg"
                    textAlign="left"
                    onClick={() => handleChange(option)}
                  >
                    {option}
                  </Button>
                ))}
              </Stack>
            </RadioGroup>

            <HStack width="100%" mt={6} justifyContent="space-between">
              <Button
                onClick={prevStep}
                colorScheme="gray"
                size="lg"
                isDisabled={step === 1}
              >
                Previous
              </Button>
              <Button
                onClick={nextStep}
                colorScheme={step === Object.keys(questions).length ? 'teal' : 'pink'} // Teal for submit, pink for next
                size="lg"
                isDisabled={!answers[step]} // Disable "Next" button if no answer is selected
              >
                {step === Object.keys(questions).length ? 'Submit' : 'Next'}
              </Button>
            </HStack>
          </VStack>
        </Box>
        <Text fontSize="sm" color="gray.500" textAlign="center" mt={6}>
          We're here to help you find the perfect pet.
        </Text>
      </Container>
    </Box>
  );
};

export default Quiz;