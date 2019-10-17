const express = require("express");
const socket = require("socket.io");

const app = express();

const server = app.listen(2350, function() {
  console.log("listening on port 2350");
});

app.use(express.static("public"));

let io = socket(server);

io.on("connection", function(socket) {
  console.log("user connected " + socket.id);
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.on("chatMessage", function(data) {
    io.emit("chatMessage", data);
  });
});
