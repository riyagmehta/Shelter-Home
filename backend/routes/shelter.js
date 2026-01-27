const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Shelter, Pet } = require("../models"); // Add Pet model here
const router = express.Router();

router.get("/shelters", async (req, res) => {
  try {
    const results = await Shelter.findAll();
    res.status(200).json(results);
  } catch (error) {
    console.error("Failed to retrieve shelters:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const shelterId = req.params.id;

    const shelter = await Shelter.findByPk(shelterId);
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    res.status(200).json(shelter);
  } catch (error) {
    console.error('Failed to fetch shelter:', error);
    res.status(500).json({ message: 'Failed to fetch shelter', error: error.message });
  }
});

// Shelter login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const shelter = await Shelter.findOne({ where: { email } });

    if (!shelter) {
      return res.status(404).json({ message: "Shelter not found" });
    }

    const isMatch = password == shelter.password;

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: shelter.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, shelter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch all pets for a specific shelter
router.get('/:id/pets', async (req, res) => {
    try {
      const pets = await Pet.findAll({
        where: { shelterId: req.params.id },
      });
      res.status(200).json(pets);
    } catch (error) {
      console.error('Failed to retrieve pets:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;