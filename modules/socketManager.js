const chat = require("./chatManager");
const player = require("./playerManager");

const manager = function(socket, io) {
  socket.on("disconnect", function() {
    chat.disconnect(socket.id, io);
  });
  socket.on("chatMessage", function(data) {
    chat.msg(socket.id, data, io);
  });
  socket.on("message", function(data) {
    //from socketid, channel, message
  });
  socket.on("login", function(username) {
    chat.addClient(socket.id, username + "_guest");
  });
  socket.on("lastMessages", () => {
    chat.getLastMessages(socket.id, io);
  });

  let p1 = {
    y: 100,
  };

  socket.on("pingpong",(data)=>{

    data.up ? p1.y-=3 : false;
    data.down ? p1.y+=3 : false;

    const gameData = {
      p1
    };

    socket.emit("pingpong",{
      p1: p1,
      p2: false
    });
    socket.broadcast.emit("pingpong",{
      p2: p1,
      p1: false,
    })


  });

  socket.on("player", function(data) {
    player.playing = data.playing;
    player.position = data.position;
    player.source = data.source;
    clearInterval(player.timer);
    if (data.playing) {
      player.timer = setInterval(function() {
        player.position++;
      }, 1000);
    }
    io.emit("playing", {
      playing: data.playing,
      position: data.position,
      source: data.source
    });
  });
  socket.on("getPlayerInfo", function() {
    socket.emit("playerInfo", {
      playing: player.playing,
      position: player.position,
      source: player.source
    });
  });
};

module.exports = {
  manager: manager
};
