let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === "development"?"http://localhost:5173":"/",
        methods: ["GET", "POST"],
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
