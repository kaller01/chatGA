const express = require("express");
const socket = require("socket.io");
const socketManager = require("./modules/socketManager");
const session = require("express-session");
const router = require("./modules/router");
const db = require("./db/db");
const ejs = require("ejs");
const app = express();
const dev = require("./modules/dev");

const server = app.listen(dev.port, dev.host, function() {
  console.log(`Server running at http://${dev.host}:${dev.port}/`);
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

app.post("/api/messages", async function(req, res) {
    await res.json(await db.getLastMessages('all'));
});

app.get("/", async function(req, res) {
 await router.home(req,res,io);
});
app.get("/users", function(req, res) {
  router.users(req,res);
});


app.use(express.static("public"));


io.on("connection", function(socket) {
  console.log(socket.id);
  socketManager.manager(socket, io);
});


