const express = require("express");
const router = express.Router();
const { QuizResult, Pet, Shelter, User } = require("../models");
const { Op } = require("sequelize");

const multer = require("multer");
const upload = multer();

router.get("/pets", async (req, res) => {
  try {
    const pets = await Pet.findAll();

    // Generate image URLs for pets that have imageBlobs
    const petsWithImageURLs = pets.map((pet) => ({
      ...pet.get(),
      imageUrl: pet.imageBlob
        ? `http://localhost:5001/api/pets/${pet.id}/image` // URL to fetch the image
        : pet.imageUrl, // Use imageUrl if it exists
    }));

    res.status(200).json(petsWithImageURLs);
  } catch (error) {
    console.error("Failed to retrieve pets:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/pets/:id", async (req, res) => {
  const { id } = req.params; // Extract the ID from the route parameters

  try {
    const pet = await Pet.findByPk(id, {
      include: [
        {
          model: Shelter,
          as: "shelter", // This should match the alias defined in Pet's association
          attributes: ["name"],
        },
      ],
    });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.json(pet);
  } catch (error) {
    console.error("Failed to retrieve the pet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/match-pets", async (req, res) => {
  const { userId, types, color, gender, minAge, maxAge, minFee, maxFee } =
    req.query;

  // Define exerciseMapping and homeFrequencyMapping
  const exerciseMapping = {
    "More than an hour": [
      "More than an hour",
      "1 hour",
      "30 minutes",
      "Little to none",
    ],
    "1 hour": ["1 hour", "30 minutes", "Little to none"],
    "30 minutes": ["30 minutes", "Little to none"],
    "Little to none": ["Little to none"],
  };

  const homeFrequencyMapping = {
    Always: ["Always", "Often", "Sometimes", "Rarely"],
    Often: ["Often", "Sometimes", "Rarely"],
    Sometimes: ["Sometimes", "Rarely"],
    Rarely: ["Rarely"],
  };

  if (!userId) {
    return res.status(400).json({ error: "Invalid or missing userId" });
  }

  try {
    const userQuizResults = await QuizResult.findOne({ where: { userId } });
    if (!userQuizResults) {
      return res
        .status(404)
        .json({ error: "No quiz results found for the user" });
    }

    let allPets = await Pet.findAll({
      where: {
        availability: true,
        ...(types && { types }),
        ...(color && { color }),
        ...(gender && { gender }),
        ...(minAge && maxAge && { age: { [Op.between]: [minAge, maxAge] } }), // Age range filter
        ...(minFee &&
          maxFee && { adoptionFee: { [Op.between]: [minFee, maxFee] } }), // Adoption fee range filter
      },
      include: [
        {
          model: Shelter, // Include the associated Shelter model
          as: "shelter", // Use the alias defined in the Pet model
          attributes: ["name"], // Only include the shelter name
        },
      ],
    });

    allPets = allPets.filter(
      (pet) =>
        !pet.interestedUsers || !pet.interestedUsers.includes(parseInt(userId))
    );

    const matchingPets = allPets.filter((pet) => {
      let matchCount = 0;

      if (
        userQuizResults.sizePreference &&
        pet.sizePreference === userQuizResults.sizePreference
      ) {
        matchCount++;
      }

      if (
        userQuizResults.exerciseAmount &&
        exerciseMapping[userQuizResults.exerciseAmount].includes(
          pet.exerciseAmount
        )
      ) {
        matchCount++;
      }

      if (
        userQuizResults.homeFrequency &&
        homeFrequencyMapping[userQuizResults.homeFrequency].includes(
          pet.homeFrequency
        )
      ) {
        matchCount++;
      }

      if (
        userQuizResults.otherPets === "No other pets" &&
        pet.otherPets === "No other pets"
      ) {
        matchCount++;
      }

      if (
        userQuizResults.specialCareNeed &&
        pet.specialCareNeed === userQuizResults.specialCareNeed
      ) {
        matchCount++;
      }

      if (
        userQuizResults.petAgePreference &&
        pet.petAgePreference === userQuizResults.petAgePreference
      ) {
        matchCount++;
      }

      return matchCount >= 2;
    });

    res.json({ pets: matchingPets });
  } catch (error) {
    console.error("Error fetching matching pets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/pets", upload.single("imageBlob"), async (req, res) => {
  try {
    const {
      shelterId,
      types,
      breed,
      color,
      age,
      gender,
      adoptionFee,
      availability,
      sizePreference,
      exerciseAmount,
      homeFrequency,
      otherPets,
      specialCareNeed,
      petAgePreference,
      imageUrl,
    } = req.body;

    console.log("data");
    console.log(req.body);  

    const newPet = await Pet.create({
      shelterId,
      types,
      breed,
      color,
      age,
      gender,
      adoptionFee,
      availability,
      sizePreference,
      exerciseAmount,
      homeFrequency,
      otherPets,
      specialCareNeed,
      petAgePreference,
      imageUrl: typeof req.body.imageUrl === "string" ? req.body.imageUrl : null,
      imageBlob: req.file ? req.file.buffer : null,
    });

    res.status(201).json(newPet);
  } catch (error) {
    console.error("Failed to add new pet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a pet
router.delete("/pets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findByPk(id);

    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    // Delete the pet from the database
    await pet.destroy();
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    console.error("Failed to delete pet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/pets/:id", upload.single("imageBlob"), async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    const { imageUrl, interestedUsers } = req.body;
    let updatedData = { ...req.body };

    // If a new imageBlob is provided, clear imageUrl
    if (req.file) {
      updatedData.imageBlob = req.file.buffer;
      updatedData.imageUrl = ""; // Clear imageUrl if imageBlob is uploaded
    } else if (imageUrl) {
      // If imageUrl is provided, clear imageBlob
      updatedData.imageBlob = null;
      updatedData.imageUrl = imageUrl;
    }

    // Ensure interestedUsers is an array of integers
    if (interestedUsers) {
      try {
        updatedData.interestedUsers = Array.isArray(interestedUsers)
          ? interestedUsers.map((value) => {
              const parsed = parseInt(value, 10);
              return isNaN(parsed) ? null : parsed; // Replace NaN with null
            }).filter((value) => value !== null) // Remove invalid values
          : JSON.parse(interestedUsers)
              .map((value) => {
                const parsed = parseInt(value, 10);
                return isNaN(parsed) ? null : parsed; // Replace NaN with null
              })
              .filter((value) => value !== null); // Remove invalid values
      } catch (error) {
        console.error("Error parsing interestedUsers:", error);
        updatedData.interestedUsers = []; // Default to empty array on failure
      }
    } else {
      updatedData.interestedUsers = []; // Default to empty array if null or undefined
    }

    // Handle null or empty `userId`
    if (!updatedData.userId || updatedData.userId === "") {
      updatedData.userId = null; // Explicitly set to null
    }

    // Update the pet with the sanitized data
    await pet.update(updatedData);
    res.status(200).json(pet);
  } catch (error) {
    console.error("Failed to update pet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/pets/:id/request-adopt", async (req, res) => {
  const { id } = req.params;
  const userId = parseInt(req.body.userId, 10); // Convert userId to integer

  try {
    const pet = await Pet.findByPk(id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (!Array.isArray(pet.interestedUsers)) {
      pet.interestedUsers = []; // Initialize if not array
    }

    if (!pet.interestedUsers.includes(userId)) {
      pet.interestedUsers.push(userId);
      pet.setDataValue("interestedUsers", [...pet.interestedUsers]); // Inform Sequelize of the change
      pet.changed("interestedUsers", true);
      await pet.save();
      res.status(200).json({
        message: "Adoption request updated successfully",
        pet,
      });
    } else {
      res.status(409).json({
        message: "User has already requested adoption",
        pet,
      });
    }
  } catch (error) {
    console.error("Failed to update pet adoption:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/pets/:id/approve-adopt", async (req, res) => {
  const { id } = req.params; // Pet ID from the URL
  const { userId } = req.body; // User ID from the request body

  try {
    const pet = await Pet.findByPk(id); // Find the pet by primary key
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Update the pet's userId
    await pet.update({
      userId,
      availability: false,
    });

    res.status(200).json({
      message: "Pet adoption updated successfully",
      pet,
    });
  } catch (error) {
    console.error("Failed to update pet adoption:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/pets/:id/image", async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);

    if (!pet || !pet.imageBlob) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Set appropriate headers for serving an image
    res.setHeader("Content-Type", "image/jpeg"); // Or image/png, depending on your image type
    res.send(pet.imageBlob); // Send the BLOB data
  } catch (error) {
    console.error("Failed to serve image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all pets adopted by a specific user
router.get("/user/:userId/pets", async (req, res) => {
  const { userId } = req.params; // Get the userId from the URL parameter

  try {
    const pets = await Pet.findAll({
      where: {
        [Op.or]: [
          { userId: userId }, // Directly adopted by the user
          { interestedUsers: { [Op.contains]: [userId] } }, // User is in the interestedUsers array
        ],
      },
      include: [
        {
          model: Shelter,
          as: "shelter",
          attributes: ["name"], // Including shelter details
        },
      ],
    });

    if (pets.length === 0) {
      return res.status(404).json({ message: "No pets found for this user." });
    }

    res.json(pets); // Send the pets found to the client
  } catch (error) {
    console.error("Failed to retrieve pets for the user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/shelter/:shelterId/pets-with-interests", async (req, res) => {
  const { shelterId } = req.params;

  try {
    // Fetch all pets under the specified shelter
    const allPets = await Pet.findAll({
      where: { shelterId: shelterId },
      include: [
        {
          model: Shelter,
          as: "shelter",
          attributes: ["name"], // Including shelter details
        },
      ],
    });

    // Filter pets to find those with interests or those no longer available
    const petsWithInterests = allPets.filter(
      (pet) => pet.interestedUsers.length > 0 || !pet.availability
    );

    if (petsWithInterests.length === 0) {
      return res
        .status(404)
        .json({ message: "No pets with interests found for this shelter." });
    }

    res.json(petsWithInterests);
  } catch (error) {
    console.error("Failed to retrieve pets with interests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
