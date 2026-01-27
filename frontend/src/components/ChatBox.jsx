import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import {
  Box,
  Input,
  Button,
  VStack,
  Text,
  InputGroup,
  InputRightElement,
  Textarea,
  Badge,
} from "@chakra-ui/react";
import { IoMdSend } from "react-icons/io";

const ChatBox = ({ senderId, recipientId, senderType }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [hasNewMessage, setHasNewMessage] = useState(false); // State to track new messages
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("http://localhost:5001");

    const fetchMessages = async () => {
      const response = await axios.get(
        `http://localhost:5001/api/chat/conversation/${senderId}/${recipientId}/${senderType}`
      );
      setMessages(response.data.messages || []);
    };

    fetchMessages();

    socketRef.current.emit("joinRoom", { senderId, recipientId });

    socketRef.current.on("message", (receivedMessage) => {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      setHasNewMessage(true); // Set new message flag
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [senderId, recipientId, senderType]);

  const sendMessage = async () => {
    if (message.trim()) {
      const msgData = {
        senderId: senderId,
        recipientId: recipientId,
        content: message,
        senderType: senderType,
      };

      try {
        const response = await axios.post(
          "http://localhost:5001/api/chat/send",
          msgData
        );
        console.log("Message sent and saved:", response.data);
        setMessage(""); // Clear the input after sending
        setHasNewMessage(false); // Reset new message flag
      } catch (error) {
        console.error(
          "Failed to save message:",
          error.response?.data || error.message
        );
      }
    }
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const clearNewMessageFlag = () => {
    setHasNewMessage(false); // Clear the new message notification
  };

  return (
    <Box p={4} bg="gray.100" borderRadius="md" mb={4}>
      {/* Notification Badge */}
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Chat
        {hasNewMessage && (
          <Badge ml={2} colorScheme="red" onClick={clearNewMessageFlag}>
            New
          </Badge>
        )}
      </Text>

      <VStack spacing={2} maxH="20rem" overflowY="auto">
        {messages.map((msg, index) => (
          <Box
            key={index}
            bg={
              msg.senderId.toString() === senderId.toString() &&
              msg.senderType === senderType
                ? "teal.100"
                : "orange.100"
            }
            p={2}
            borderRadius="md"
            alignSelf={
              msg.senderId.toString() === senderId.toString() &&
              msg.senderType === senderType
                ? "flex-end"
                : "flex-start"
            }
            maxW="100%" // Ensure the message box does not exceed the width of the container
            wordBreak="break-word" // Break long words to fit within the container
          >
            <Text>{msg.content}</Text>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </VStack>
      <InputGroup size="md" mt={4}>
        <Textarea
          pr="4.5rem" // Add padding to prevent text from being hidden behind the icon
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(event) => (event.key === "Enter" ? sendMessage() : null)}
          resize="none" // Optional: Prevent the user from resizing the textarea
          overflow="hidden" // Prevent scrollbar from appearing
          minHeight="40px" // Set a minimum height for aesthetics
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={sendMessage}>
            <IoMdSend />
          </Button>
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export default ChatBox;