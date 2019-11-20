const express = require("express");
const socket = require("socket.io");
const socketManager = require("./modules/socketManager");
const session = require("express-session");

const db = require('./db/db');
const ejs = require('ejs');
const port = 3200;
const MartinRemote="192.168.250.60";
const AlbinRemote="192.168.250.52";
const Martin="192.168.2.199";
const local="localhost";
const host = MartinRemote;
const app = express();

app.get('/users/:username', function (req, res) {
  let user = req.params.username;
  db.searchByUsername(user).then(r=>{
    res.render('index',{data:r});
    console.log(r);
  });
});

app.get('/users', function (req, res) {
  db.getAllUsers().then(r=>{
    res.render('index',{data:r});
  });
});

app.set('view engine','ejs');
app.get('/ejs',(req,res)=>{
  res.render('index',{data:'hello world!'});
});

app.use(session({
  secret: 'hemlig',
  resave: false,
  saveUninitialized: false
}));

app.get('/session',(req,res,next)=>{
  req.session.viewCount +=1;
  res.render('test.ejs',{viewCount: req.session.viewCount});
});

app.get('/login',(req,res,next)=>{
  res.render('login.ejs',{host: host});
});

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.post('/dashboard', async function(req, res){
  if(await db.login(req.body.username,req.body.password)){
    req.session.username = req.body.username;
    req.session.password = req.body.password;
    res.render('user.ejs',{username: req.session.username, password: req.session.password});
  } else {
    req.session.username = req.body.username;
    req.session.password = req.body.password;
    res.render('error.ejs');
  }
});

app.post('/req', async function(req, res){
  if(await db.login(req.body.username,req.body.password)){
    req.session.username = req.body.username;
    req.session.password = req.body.password;
    await res.json(req.body.username);
  } else {
    req.session.username = req.body.username;
    req.session.password = req.body.password;
    await res.json(false);
  }

});

app.get('/dashboard', async function(req, res){
  if(req.session.username){
    if(await db.login(req.session.username,req.session.password)){
      res.render('user.ejs',{username: req.session.username});
    } else {
      res.render('error.ejs');
    }
  } else {
    res.render('user.ejs',{username: 'Not logged in'});
  }

});

const server = app.listen(port, host, function() {
  console.log(`Server running at http://${host}:${port}/`);
});

app.use(express.static("public"));

let io = socket(server);

io.on("connection", function(socket) {
  socketManager.manager(socket, io);
});