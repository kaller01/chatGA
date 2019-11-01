const express = require("express");
const socket = require("socket.io");
const socketManager = require("./modules/socketManager");
const port = 3200;
const MartinRemote="192.168.250.60";
const AlbinRemote="192.168.250.52";
const Martin="192.168.2.199";
const local="localhost";
const host = Martin;
const app = express();

app.get('/users', function (req, res) {
  // console.log(req);
  res.end('hej');
});

const server = app.listen(port, host, function() {
  console.log(`Server running at http://${host}:${port}/`);
});

app.use(express.static("public"));

let io = socket(server);

io.on("connection", function(socket) {
  socketManager.manager(socket, io);
});