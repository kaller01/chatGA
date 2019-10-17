const express = require("express");
const socket = require("socket.io");
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
    clients.forEach(function (client) {
      if(client.getId()!=socket.id){
        console.log(data.username);
        console.log(socket.id);
        clients.push(new Client(socket.id, data.username));
      }
    });
    msg(socket.id, data.username, data.message);
  });
});

//Object Client
function Client(socketid, name){
  let id=socketid;
  let username=name;
  this.getId = function () {
    return id;
  };
  this.getUsername = function () {
    return username;
  }
}

//Array with clients
let clients = [];
//Dummy data
clients.push(new Client(67891, "Dan"));

let msg = function(fromId, fromUser, message) {

  //checks for /msg
  if(message.startsWith('/msg')){

    //gets the receiver
    let receiver = message.split(/\s+/)[1];
    console.log(receiver);

    //lops through each client and checks username
    clients.forEach(function (client) {
      if(client.getUsername()===receiver){
        console.log('true');
        //sends the message
        io.to(client.getId()).emit('chatMessage',{
          message: message,
          username: fromUser
        });
      }
    });
    //if it isnt private message
  } else {
    io.emit("chatMessage", {
      message: message,
      username: fromUser
    });
    console.log('c');
  }
};