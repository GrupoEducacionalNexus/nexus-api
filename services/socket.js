// services/socket.js
const { Server } = require('socket.io');

let io;

module.exports = {
  init: (server) => {
    console.log('Client connected');
    io = new Server(server, {
      cors: {
        cors: [
          "https://www.gestorgruponexus.com.br",
          "http://localhost:3000"
        ],
        methods: ["GET", "POST", "PUT"]
      }
    })
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.IO not initialized!');
    }
    return io;
  },
};