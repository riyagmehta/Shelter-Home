import { Box, Text, Button, Image, Flex, Stack } from '@chakra-ui/react';
import React from 'react';
import home from "../assets/Home.png";
import { Link } from "react-router-dom"
const Home = () => {
    return (
        <>
            <Flex
                direction="row"
                align="center"
                justify="space-between"
                w="100vw"
                h="100vh"
                p={6}
                bg="white"
            >
                <Box p={"10%"} textAlign="left">
                    <Box >
                        <Text
                            fontSize="54px"
                            fontWeight="700"
                            color="#120e2f"
                        >
                            The best way to find your  perfect pet.
                        </Text>

                        <Text
                            fontSize="34px"
                            color="gray.600"
                        >
                            Discover your ideal pet companion.
                        </Text>
                    </Box>
                    <Stack direction="row" spacing={4} mt={6}>
                        <Button
                            backgroundColor="pink"
                            color="#120e2f"
                            fontSize="20px"
                            fontWeight="600"
                            p={"2%"}
                            borderRadius="30px"
                            mr="2%"
                            _hover={{ backgroundColor: "#120e2f", color: "white" }}
                        >
                            <Link color="#120e2f" to="/signin">Take the pet quiz </Link>
                        </Button>
                        <Button
                            backgroundColor="#120e2f"
                            color="white"
                            fontSize="22px"
                            width="20%"
                            fontWeight="600"
                            p={"2%"}
                            borderRadius="30px"
                            _hover={{
                                backgroundColor: "pink",
                                color: "#120e2f"
                            }}
                        >
                            <Link color="white" to="/login">Login </Link>
                        </Button>
                    </Stack>
                </Box>

                <Box width="90%" display=" flex" justifyContent="center" alignItems="center">
                    <Image src={home} boxSize="100%" objectFit="cover" />
                </Box>
            </Flex >
        </>
    );
};

export default Home;
