const express = require("express");
const socket = require("socket.io");
const test = require("./modules/test");
const port = 3200;
const hostname="192.168.2.199";


const app = express();

const server = app.listen(port, hostname, function() {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.use(express.static("public"));

let io = socket(server);

io.on("connection", function(socket) {
  console.log("user connected " + socket.id);
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.on("chatMessage", function(data) {
    test.clients.forEach(function (client) {
      if(client.getId()!=socket.id){
        console.log(data.username);
        console.log(socket.id);
        test.clients.push(new test.Client(socket.id, data.username));
      }
    });
    test.msg(socket.id, data.username, data.message, io);
  });
});

