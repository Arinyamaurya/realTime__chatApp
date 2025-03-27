const express=require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
app.use(express.static(__dirname));
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust in production
    methods: ["GET", "POST"]
  }
});

// Store connected users
const users = {};

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Handle new user joining
  socket.on('new-user', (username) => {
    users[socket.id] = username;
    socket.broadcast.emit('user-connected', username);
    updateOnlineUsers();
  });

  // Handle incoming messages
  socket.on('send-message', (message) => {
    socket.broadcast.emit('receive-message', {
      message: message,
      username: users[socket.id]
    });
  });

  // Handle typing indicator
  socket.on('typing', () => {
    socket.broadcast.emit('user-typing', users[socket.id]);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const username = users[socket.id];
    if (username) {
      socket.broadcast.emit('user-disconnected', username);
      delete users[socket.id];
      updateOnlineUsers();
    }
  });

  // Update all clients with current online users
  function updateOnlineUsers() {
    io.emit('online-users', Object.values(users));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});