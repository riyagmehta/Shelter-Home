const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketIo = require('socket.io');

const userRoutes = require('./routes/user');
const quizRoutes = require('./routes/quiz');
const petRoutes = require('./routes/pet');
const shelterRoutes = require('./routes/shelter');
const adoptionApplicationRoutes = require('./routes/adoption');
const chatRoutes = require('./routes/chatRoutes');


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
      origin: ["https://shelter-home.onrender.com", "http://localhost:3000", "*"], // Allow all for now
      methods: ["GET", "POST"]
  }
});
global.io = io; // This sets the socket.io to global variable


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', ({ senderId, recipientId }) => {
        const roomName = [senderId, recipientId].sort().join('_');
        socket.join(roomName);
        console.log(`User ${senderId} joined room ${roomName}`);
    });

    socket.on('sendMessage', (message) => {
        const roomName = [message.senderId, message.recipientId].sort().join('_');
        io.to(roomName).emit('message', message);
        console.log(`Message sent to room ${roomName}: ${message.content}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: "*", // Allow all origins for now
  credentials: true
}));

// Routes setup
app.use('/api/chat', chatRoutes);

app.use('/api', userRoutes);
app.use('/api', quizRoutes);
app.use('/api', petRoutes);
app.use('/api/shelters', shelterRoutes);
app.use('/api/adoption-applications', adoptionApplicationRoutes);



const port = process.env.PORT || 5001;
server.listen(port, () => { // Use 'server' not 'app' to listen
  console.log(`Server running on http://localhost:${port}`);
});