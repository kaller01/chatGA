const express = require("express");
const socket = require("socket.io");
const test = require("./modules/chatManager");
const socketManager = require("./modules/socketManager");
const port = 3200;
const hostname="192.168.2.199";
const app = express();

const server = app.listen(port, hostname, function() {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.use(express.static("public"));

let io = socket(server);

io.on("connection", function(socket) {
  socketManager.manager(socket, io);
});