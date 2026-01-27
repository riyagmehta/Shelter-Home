import React from "react";
import {
  Flex,
  Select,
  IconButton,
  Text,
  Box,
  RangeSlider,
  RangeSliderThumb,
  RangeSliderFilledTrack,
  RangeSliderTrack,
} from "@chakra-ui/react";
import { AiOutlineClose } from "react-icons/ai";

// Common styles for reuse
const commonSelectStyles = {
  bg: "pink.100",
  borderRadius: "30px",
  borderColor: "pink.100",
  size: "lg",
  color: "#120e2f",
  fontWeight: 600,
};

// A reusable component for Select filter fields
const FilterField = ({ name, placeholder, value, options, handleFilterChange, clearFilter }) => (
  <Flex direction="row" alignItems="center" width="100%" mr={4}>
    <Select
      placeholder={placeholder}
      value={value}
      name={name}
      onChange={handleFilterChange}
      {...commonSelectStyles}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Select>
    {value && (
      <IconButton
        aria-label={`Clear ${name} filter`}
        icon={<AiOutlineClose />}
        size="sm"
        ml={2}
        onClick={() => clearFilter(name)}
      />
    )}
  </Flex>
);

// A reusable component for RangeSlider fields
const SliderField = ({ name, label, min, max, step, value, handleFilterChange, clearFilter }) => (
  <Flex direction="column" gap={4} width="100%" mr={4} ml={4}>
    <Text fontWeight={600}>{label}</Text>
    <RangeSlider
      aria-label={[`${name}Min`, `${name}Max`]}
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(value) => handleFilterChange({ target: { name, value } })}
    >
      <RangeSliderTrack bg="pink.100">
        <RangeSliderFilledTrack bg="pink.500" />
      </RangeSliderTrack>
      <RangeSliderThumb boxSize={4} index={0}>
        <Box color="pink.500" as={AiOutlineClose} />
      </RangeSliderThumb>
      <RangeSliderThumb boxSize={4} index={1}>
        <Box color="pink.500" as={AiOutlineClose} />
      </RangeSliderThumb>
    </RangeSlider>
    <Flex justify="space-between">
      <Box fontSize="10px">
        <Text>{`Min ${label}: ${value[0]}`}</Text>
        <Text>{`Max ${label}: ${value[1]}`}</Text>
      </Box>
      <IconButton
        aria-label={`Clear ${name} filter`}
        icon={<AiOutlineClose />}
        size="sm"
        onClick={() => clearFilter(name)}
      />
    </Flex>
  </Flex>
);

const FilterSection = ({ filters, handleFilterChange, clearFilter }) => {
  return (
    <Box bg="white" pb={8}>
      <Flex direction="row" alignItems="center" justifyContent="space-between">
        <FilterField
          name="types"
          placeholder="Type"
          value={filters.types}
          options={["Dog", "Cat", "Bird", "Rabbits", "Fish"]}
          handleFilterChange={handleFilterChange}
          clearFilter={clearFilter}
        />
        <FilterField
          name="color"
          placeholder="Color"
          value={filters.color}
          options={["Black", "White", "Brown", "Mixed", "Other"]}
          handleFilterChange={handleFilterChange}
          clearFilter={clearFilter}
        />
        <FilterField
          name="gender"
          placeholder="Gender"
          value={filters.gender}
          options={["Male", "Female"]}
          handleFilterChange={handleFilterChange}
          clearFilter={clearFilter}
        />
        <SliderField
          name="ageRange"
          label="Age Range"
          min={0}
          max={20}
          step={1}
          value={[filters.minAge, filters.maxAge]}
          handleFilterChange={handleFilterChange}
          clearFilter={clearFilter}
        />
        <SliderField
          name="adoptionFeeRange"
          label="Adoption Fee Range"
          min={0}
          max={500}
          step={10}
          value={[filters.minFee, filters.maxFee]}
          handleFilterChange={handleFilterChange}
          clearFilter={clearFilter}
        />
      </Flex>
    </Box>
  );
};

export default FilterSection;