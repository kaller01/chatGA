const express = require("express");
const socket = require("socket.io");
const socketManager = require("./modules/socketManager");
const session = require("express-session");
const router = require("./modules/router");
const db = require("./db/db");
const ejs = require("ejs");
const app = express();
const dev = require("./modules/dev");


const server = app.listen(dev.port, function () {
    console.log(`Server running at http://localhost:${dev.port}/`);
});

const io = socket(server);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(
    session({
        secret: "hemlig",
        resave: false,
        saveUninitialized: false
    })
);

app.post("/api/login", async function (req, res) {
    await router.loginAccount(req, res, io);
});
app.post("/api/create", async function (req, res) {
    await router.createAccount(req, res, io);
});

app.post("/api/messages", async function (req, res) {
    await res.json(await db.getLastMessages("all"));
});

app.get("/", async function (req, res) {
    await router.home(req, res, io);
});
app.get("/users", function (req, res) {
    router.users(req, res);
});

app.use(express.static("public"));


let players = [];

let rooms = [];

io.on("connection", function (socket) {
    // console.log(socket.id);
    socketManager.manager(socket, io);

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
                        xspeed: (Math.random()*5+2)*(Math.round(Math.random()) * 2 - 1),
                        yspeed: (Math.random()*4)*(Math.round(Math.random()) * 2 - 1)
                    },
                    players: {
                    }
                }
            }
            if (!rooms[data.room].players[socket.id]) {
                console.log(data.room,socket.id,data.room.includes(socket.id));
                if(data.room.includes(socket.id)){
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
            if(data.room.includes(socket.id)){
                data.up ? rooms[data.room].p1.y -= 3 : false;
                data.down ? rooms[data.room].p1.y += 3 : false;
            } else {
                data.up ? rooms[data.room].p2.y -= 3 : false;
                data.down ? rooms[data.room].p2.y += 3 : false;
            }
        }

        // console.log(room);
        console.log(rooms);
        if(rooms[data.room]){
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
});

setInterval(draw, 1000 / 60);


function draw() {
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

