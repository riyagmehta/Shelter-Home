import { Box, Flex, Text, Button, Icon, Menu, MenuButton, MenuList, MenuItem, useDisclosure, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from "@chakra-ui/react";
import { FaUser, FaChevronDown } from "react-icons/fa";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Header = () => {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState(""); // State for storing the username
  const navigate = useNavigate();

  const { isOpen: isLogoutOpen, onOpen: onLogoutOpen, onClose: onLogoutClose } = useDisclosure();
  const { isOpen: isQuizOpen, onOpen: onQuizOpen, onClose: onQuizClose } = useDisclosure();
  const cancelRef = useRef();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUsername(storedUserId); // Fetch the username when the component mounts
    }
  }, []);

  // Fetch the username using the userId
  const fetchUsername = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/users/${id}`);
      setUsername(response.data.username);
    } catch (error) {
      console.error("Failed to fetch username:", error);
    }
  };

  const handlePreviousAdoptions = () => {
    navigate('/previous-adoptions', { state: { userId } });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  const handleConfirmQuizRetake = () => {
    onQuizClose();
    navigate('/quiz', { state: { userId } });
  };

  const handleNavigation = () => {
    if (userId) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <Flex
      as="header"
      bg="white"
      pb={"20px"}
      mb={"5px"}
      borderBottom="1px"
      borderColor="gray.200"
      alignItems="center"
      justifyContent="space-between"
    >
      <Text fontSize="24px" fontWeight="700" color="#120e2f" cursor="pointer" onClick={handleNavigation}>
        SweetHome
        <Text as="span" color="pink.400">
          Finder
        </Text>
      </Text>

      {/* Display the welcome message in the middle */}
      <Text fontSize="xl" fontWeight="bold" color="gray.400">
        Hello, {username}
      </Text>

      <Flex>
        <Button
          variant="solid"
          colorScheme="pink"
          size="md"
          borderRadius="20px"
          mr={4}
          onClick={onQuizOpen}
        >
          Retake Pet Quiz
        </Button>

        <Menu>
          <MenuButton
            as={Button}
            variant="solid"
            colorScheme="pink"
            size="md"
            borderRadius="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            rightIcon={<FaChevronDown />}
          >
            <FaUser />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={handlePreviousAdoptions}>
              Previous Adoptions
            </MenuItem>
            <MenuItem onClick={onLogoutOpen}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>

        <AlertDialog
          isOpen={isLogoutOpen}
          leastDestructiveRef={cancelRef}
          onClose={onLogoutClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Confirm Logout
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to logout?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onLogoutClose}>
                  Cancel
                </Button>
                <Button colorScheme="pink" onClick={handleLogout} ml={3}>
                  Logout
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <AlertDialog
          isOpen={isQuizOpen}
          leastDestructiveRef={cancelRef}
          onClose={onQuizClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Retake Pet Quiz
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to retake the pet quiz? Your previous quiz results will be overwritten.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onQuizClose}>
                  Cancel
                </Button>
                <Button colorScheme="pink" onClick={handleConfirmQuizRetake} ml={3}>
                  Retake Quiz
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Flex>
    </Flex>
  );
};

export default Header;