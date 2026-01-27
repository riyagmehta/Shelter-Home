const express = require('express');
const router = express.Router();
const { QuizResult, User } = require('../models');

router.get('/quiz', async (req, res) => {
    try {
        const results = await QuizResult.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error('Failed to retrieve quiz results:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/results', async (req, res) => {
    console.log('Request body:', req.body); 
    const {
      userId,
      '1': sizePreference,
      '2': exerciseAmount,
      '3': homeFrequency,
      '4': otherPets,
      '5': specialCareNeed,
      '6': petAgePreference
    } = req.body;
  
    if (!userId || typeof userId !== 'number') {
      return res.status(400).json({ error: "Invalid or missing userId" });
    }
  
    try {
      const userExists = await User.findByPk(userId);
      if (!userExists) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Check if quiz results already exist for this user
      let quizResult = await QuizResult.findOne({ where: { userId } });
  
      if (quizResult) {
        // Update the existing quiz result
        quizResult = await quizResult.update({
          sizePreference,
          exerciseAmount,
          homeFrequency,
          otherPets,
          specialCareNeed,
          petAgePreference
        });
      } else {
        // Create a new quiz result
        quizResult = await QuizResult.create({
          userId,
          sizePreference,
          exerciseAmount,
          homeFrequency,
          otherPets,
          specialCareNeed,
          petAgePreference
        });
      }
  
      res.status(201).json(quizResult);
    } catch (error) {
      console.error('Failed to save quiz results:', error);
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
