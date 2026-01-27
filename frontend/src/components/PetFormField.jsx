import React from 'react';
import { FormControl, FormLabel, Select, Input, VStack } from '@chakra-ui/react';

const PetFormField = ({ label, value, onChange, options = null, isRequired = true, placeholder }) => {
  return (
    <FormControl isRequired={isRequired}>
      <FormLabel fontWeight="semibold" color="teal.600">
        {label}
      </FormLabel>
      {options ? (
        <Select
          value={value}
          onChange={onChange}
          placeholder={placeholder || `Select ${label.toLowerCase()}`}
          focusBorderColor="teal.400"
          bg="gray.50"
          borderRadius="lg"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          value={value}
          onChange={onChange}
          focusBorderColor="teal.400"
          bg="gray.50"
          borderRadius="lg"
        />
      )}
    </FormControl>
  );
};

export default PetFormField;