const express = require("express");
const socket = require("socket.io");
const socketManager = require("./modules/socketManager");
const session = require("express-session");
const router = require("./modules/router");
const db = require("./db/db");
const ejs = require("ejs");
const app = express();

const port = 3200;
const MartinRemote = "192.168.250.60";
const AlbinRemote = "192.168.250.52";
const Martin = "192.168.2.199";
const local = "localhost";
const host = MartinRemote;


const server = app.listen(port, host, function() {
  console.log(`Server running at http://${host}:${port}/`);
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

app.post("/api/login", async function(req, res) {
  await router.loginAccount(req,res,io)
});
app.post("/api/create", async function(req, res) {
  await router.createAccount(req,res);
});

app.get("/", async function(req, res) {
 await router.home(req,res,io);
});
app.get("/users", function(req, res) {
  router.users(req,res);
});

io.on("connection", function(socket) {
  console.log(socket.id);
  socketManager.manager(socket, io);
});


