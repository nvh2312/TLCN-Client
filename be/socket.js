let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        // origin: process.env.NODE_ENV === "development"?"http://localhost:5173":"/",
        origin:
          process.env.NODE_ENV === "development"
            ? ["http://localhost:5173", "http://localhost:3001"]
            : ["/", "https://hcadmin.onrender.com"],
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
