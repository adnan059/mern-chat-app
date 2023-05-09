require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const ios = require("socket.io");
const connectDB = require("./config/db");

const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const msgRoute = require("./routes/msgRoute");

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/message", msgRoute);

app.use((err, req, res, next) => {
  const message = err.message || "Something went wrong!";
  const status = err.status || 500;
  return res.status(status).json({
    message: message,
    status: status,
    success: false,
    stack: err.stack,
  });
});

const server = app.listen(PORT, () =>
  console.log(`Server listening to port ${PORT}`)
);

const io = ios(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room : " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined!");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", (userData) => {
    console.log("User Disconnected : " + userData._id);
    socket.leave(userData._id);
  });
});
