const chat = require("./chatManager");
const player = require("./playerManager");

let players = [];
let rooms = [];

const manager = function (socket, io) {
    socket.on("disconnect", function () {
        chat.disconnect(socket.id, io);
    });
    socket.on("chatMessage", function (data) {
        chat.msg(socket.id, data, io, socket);
    });
    socket.on("login", function (username) {
        chat.addClient(socket.id, username + "_guest");
    });
    socket.on("lastMessages", () => {
        chat.getLastMessages(socket.id, io);
    });
    let room;
    socket.on("pongaccept", (data) => {
        socket.join(data.room);
        console.log(room);
    });


    socket.on("player", function (data) {
        player.playing = data.playing;
        player.position = data.position;
        player.source = data.source;
        clearInterval(player.timer);
        if (data.playing) {
            player.timer = setInterval(function () {
                player.position++;
            }, 1000);
        }
        io.emit("playing", {
            playing: data.playing,
            position: data.position,
            source: data.source
        });
    });
    socket.on("getPlayerInfo", function () {
        socket.emit("playerInfo", {
            playing: player.playing,
            position: player.position,
            source: player.source
        });
    });

    if (!players[socket.id]) {
        players[socket.id] = {
            y: 100
        }
    }

    socket.on("pingpong", (data) => {
        // data.up ? players[socket.id].y -= 3 : false;
        // data.down ? players[socket.id].y += 3 : false;

        if (data.room) {
            if (!rooms[data.room]) {
                rooms[data.room] = {
                    ball: {
                        x: 1100 / 2,
                        y: 700 / 2,
                        width: 20,
                        height: 20,
                        xspeed: (Math.random() * 5 + 2) * (Math.round(Math.random()) * 2 - 1),
                        yspeed: (Math.random() * 4) * (Math.round(Math.random()) * 2 - 1)
                    },
                    players: {
                    }
                }
            }
            if (!rooms[data.room].players[socket.id]) {
                console.log(data.room, socket.id, data.room.includes(socket.id));
                if (data.room.includes(socket.id)) {
                    rooms[data.room].p1 = {
                        y: 100,
                        x: 100,
                    }
                } else {
                    rooms[data.room].p2 = {
                        y: 100,
                        x: 1000
                    }
                }

                rooms[data.room].players[socket.id] = true;
            }
            if (data.room.includes(socket.id)) {
                data.up ? rooms[data.room].p1.y -= 3 : false;
                data.down ? rooms[data.room].p1.y += 3 : false;
            } else {
                data.up ? rooms[data.room].p2.y -= 3 : false;
                data.down ? rooms[data.room].p2.y += 3 : false;
            }
        }

        // console.log(room);
        console.log(rooms);
        if (rooms[data.room]) {
            socket.emit("pingpong", {
                p1: rooms[data.room].p1,
                p2: false,
                ball: rooms[data.room].ball
            });
            socket.broadcast.to(data.room).emit("pingpong", {
                p2: rooms[data.room].p2,
                p1: false,
                ball: rooms[data.room].ball
            })
        }
    });
};

const pongEngine = () => {
    Object.keys(rooms).forEach(function (room) {
        if (rooms[room].ball) {
            rooms[room].ball.x += rooms[room].ball.xspeed;
            rooms[room].ball.y += rooms[room].ball.yspeed;
            if (rooms[room].ball.x < 0 || rooms[room].ball.x+rooms[room].ball.width>1100) {
                rooms[room].ball = {
                    x: 1100 / 2,
                    y: 700 / 2,
                    width: 20,
                    height: 20,
                    xspeed: (Math.random()*5+4)*(Math.round(Math.random()) * 2 - 1),
                    yspeed: (Math.random()*4+1)*(Math.round(Math.random()) * 2 - 1)
                };
            }

            if (rooms[room].ball.y < 0 || rooms[room].ball.y>700) {
                rooms[room].ball.yspeed = -rooms[room].ball.yspeed;
            }
            if(rooms[room].p1){
                if(rooms[room].ball.y < rooms[room].p1.y+100 && rooms[room].ball.x < rooms[room].p1.x && rooms[room].ball.y > rooms[room].p1.y) {
                    rooms[room].ball.xspeed = -rooms[room].ball.xspeed;
                    rooms[room].ball.yspeed = (Math.random() * 4) * (Math.round(Math.random()) * 2 - 1);
                }
            }

            if(rooms[room].p2){
                if(rooms[room].ball.y < rooms[room].p2.y+100 && rooms[room].ball.x > rooms[room].p2.x && rooms[room].ball.y > rooms[room].p2.y){
                    rooms[room].ball.xspeed = -rooms[room].ball.xspeed;
                    rooms[room].ball.yspeed = (Math.random()*4)*(Math.round(Math.random()) * 2 - 1);
                }
            }
        }
    });
}

module.exports = {
    manager,
    pongEngine,
};
