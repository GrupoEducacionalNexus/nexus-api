const { Server } = require('socket.io');

let io;

module.exports = {
  init: (server) => {
    console.log('Client connected');
    io = new Server(server, {
        cors: "http://www.gestorgruponexus.com.br",
        methods: ["GET", "POST", "PUT"]
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