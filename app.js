const express = require("express");
const socket = require("socket.io");
const socketManager = require("./modules/socketManager");
const db = require('./db/db');
const port = 3200;
const MartinRemote="192.168.250.60";
const AlbinRemote="192.168.250.52";
const Martin="192.168.2.199";
const local="localhost";
const host = MartinRemote;
const app = express();

app.get('/users/:username', function (req, res) {
  let user = req.params.username;
  db.getUser(user).then(r=>{
    console.log(r);
    let name = r[0].username;
    let rawdate = r[0].timeadded;
    let date = new Date(rawdate);
    res.send('<h1>'+name+'</h1><br>'+date);
  });
});

const server = app.listen(port, host, function() {
  console.log(`Server running at http://${host}:${port}/`);
});

app.use(express.static("public"));

let io = socket(server);

io.on("connection", function(socket) {
  socketManager.manager(socket, io);
});