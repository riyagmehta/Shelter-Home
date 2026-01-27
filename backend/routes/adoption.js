// routes/adoptionApplications.js
const express = require('express');
const router = express.Router();
const { AdoptionApplication, User, Pet } = require('../models'); // Adjust path as needed

// CREATE an adoption application for a specific pet by a user
router.post('/:petId', async (req, res) => {
  const { userId, name, email, phone, petType, breedPreference, reasonForAdoption } = req.body;
  const { petId } = req.params;

  try {
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if pet exists
    const pet = await Pet.findByPk(petId);
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    // Create a new adoption application linked to the user and pet
    const adoptionApplication = await AdoptionApplication.create({
      userId,
      petId,
      name,
      email,
      phone,
      petType,
      breedPreference,
      reasonForAdoption,
    });

    res.status(201).json({
      message: 'Adoption application submitted successfully',
      adoptionApplication,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit adoption application', details: error.message });
  }
});

// GET a specific adoption application by userId and petId
router.get('/details/:userId/:petId', async (req, res) => {
  const { userId, petId } = req.params;

  try {
    // First check if the user and the pet exist
    const userExists = await User.findByPk(userId);
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const petExists = await Pet.findByPk(petId);
    if (!petExists) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    // Find the adoption application using both userId and petId
    const adoptionApplication = await AdoptionApplication.findOne({
      where: {
        userId: userId,
        petId: petId
      }
    });

    if (!adoptionApplication) {
      return res.status(404).json({ error: 'Adoption application not found' });
    }

    res.status(200).json({
      message: 'Adoption application details retrieved successfully',
      adoptionApplication
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve adoption application details', details: error.message });
  }
});

// Fetch all adoption applications for a specific pet
router.get('/pet/:petId', async (req, res) => {
  const { petId } = req.params;

  try {
      const applications = await AdoptionApplication.findAll({
          where: { petId: petId }
      });

      if (applications.length > 0) {
          res.status(200).json({
              message: "Adoption applications retrieved successfully",
              adoptionApplications: applications
          });
      } else {
          res.status(404).json({ message: "No adoption applications found for this pet" });
      }
  } catch (error) {
      console.error('Error fetching adoption applications:', error);
      res.status(500).json({ message: "Failed to fetch adoption applications", error: error.message });
  }
});


module.exports = router;
