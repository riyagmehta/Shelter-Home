// src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { Box, Heading, Grid, Spinner, Alert } from "@chakra-ui/react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import FilterSection from "../components/FilterSection";
import PetCard from "../components/PetCard";

const Dashboard = () => {
  const location = useLocation();
  const userId = location.state?.userId || localStorage.getItem("userId");

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    types: "",
    color: "",
    gender: "",
    minAge: 0,
    maxAge: 20,
    minFee: 0,
    maxFee: 500,
  });

  // Clear filter handler
  const clearFilter = (filterName) => {
    if (filterName === "ageRange") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        minAge: 0,
        maxAge: 20,
      }));
    } else if (filterName === "adoptionFeeRange") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        minFee: 0,
        maxFee: 500,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [filterName]: "",
      }));
    }
  };

  useEffect(() => {
    const fetchMatchingPets = async () => {
      if (!userId) {
        setError("No userId found, please log in again.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5001/api/match-pets", {
          params: { userId, ...filters },
        });
        setPets(response.data.pets);
      } catch (error) {
        setError("Failed to fetch matching pets.");
        console.error("Error fetching matching pets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchingPets();
  }, [userId, filters]);

  

  const handleFilterChange = (e) => {
    const { name, value } = e.target || e;

    if (name === "ageRange") {
      const [minAge, maxAge] = value;
      setFilters((prevFilters) => ({
        ...prevFilters,
        minAge,
        maxAge,
      }));
    } else if (name === "adoptionFeeRange") {
      const [minFee, maxFee] = value;
      setFilters((prevFilters) => ({
        ...prevFilters,
        minFee,
        maxFee,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };

  if (loading) return <Spinner size="xl" />;
  if (error) return <Alert status="error">{error}</Alert>;

  return (
    <Box p={8} minH="100vh">
      <Header />
      <Box pl={24} pr={24}>
        <Box mb={10} mt={10}>
          <Heading as="h1" size="xl">
            Find your new best friend!!
          </Heading>
        </Box>

        <FilterSection
          filters={filters}
          handleFilterChange={handleFilterChange}
          clearFilter={clearFilter}å
        />

        {pets.length === 0 ? (
          <Box mt={8} color="gray.500">No pets available with the selected criteria.</Box>
        ) : (
          <Grid templateColumns="repeat(4, 1fr)" gap={6} mt={8}>
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} userId={{userId}}/>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;