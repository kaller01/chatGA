const express = require("express");
const socket = require("socket.io");
const socketManager = require("./modules/socketManager");
const port = 3200;
const hostMartinRemote="192.168.250.60";
const hostAlbinRemote="192.168.250.52";
const hostMartin="192.168.2.199";
const host="localhost";
const app = express();

const server = app.listen(port, hostAlbinRemote, function() {
  console.log(`Server running at http://${hostAlbinRemote}:${port}/`);
});

app.use(express.static("public"));

let io = socket(server);

io.on("connection", function(socket) {
  socketManager.manager(socket, io);
});