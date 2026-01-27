// controllers/chatController.js

const { Message, User, Shelter } = require("../models"); // Adjust path as needed
const { Op } = require("sequelize"); // Import the Op object from Sequelize

const sendMessage = async (req, res) => {
  try {
    const { senderId, recipientId, content, senderType } = req.body;
    let senderExists = senderType === "user" ? await User.findByPk(senderId) : await Shelter.findByPk(senderId);
    let recipientExists = await User.findByPk(recipientId) || await Shelter.findByPk(recipientId);

    if (!senderExists || !recipientExists) {
      return res.status(400).json({ message: "Invalid sender or recipient" });
    }

    const message = await Message.create({
      senderId,
      recipientId,
      content,
      senderType,
    });

    const roomName = [senderId, recipientId].sort().join('_');
    if(global.io) { // Check if global.io is available
        global.io.to(roomName).emit('message', message);
    } else {
        console.error('Socket.io is not initialized');
    }

    res.status(201).json({ message: "Message sent successfully", data: message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: "Failed to send message", error: error.toString() });
  }
};
// controllers/chatController.js

// Retrieve conversation between a user and a shelter or between two users/shelters
const getMessages = async (req, res) => {
  try {
    const { senderId, recipientId, senderType } = req.params;  // Extracting parameters from the request URL

    // Add logic here to ensure all parameters are defined
    if (!senderId || !recipientId || !senderType) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: senderId, recipientId: recipientId, senderType: senderType },
          { senderId: recipientId, recipientId: senderId, senderType: senderType === 'user' ? 'shelter' : 'user' } // Assuming reciprocal relationship
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve messages", error: error.message });
  }
};

module.exports = { sendMessage, getMessages };
