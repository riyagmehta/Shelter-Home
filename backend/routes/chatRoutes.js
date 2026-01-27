
const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/chatController');

// Route to send a message
router.post('/send', sendMessage);

// Route to retrieve messages between two users
router.get('/conversation/:senderId/:recipientId/:senderType', getMessages);




module.exports = router;
