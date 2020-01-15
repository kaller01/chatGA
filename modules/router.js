const db = require("./../db/db");
const chat = require("./chatManager");
const ejsHelpers = require("./../views/helpers/createModal");

const home = async (req,res,io) => {
    if (req.session.username) {
        if (await db.login(req.session.username, req.session.password) && req.session.password) {
            res.render("dashboard.ejs", {
                username: req.session.username,
                helpers: ejsHelpers
            });
            io.on("connection", function(socket) {
                chat.addClient(socket.id, req.session.username,io);
                chat.getLastMessages(socket.id,io);
            });
        } else if (!req.session.password) {
            res.render("dashboard.ejs", {
                username: req.session.username,
                helpers: ejsHelpers
            });
            io.on("connection", function(socket) {
                chat.addClient(socket.id, req.session.username,io);
                chat.getLastMessages(socket.id,io);
            });
        } else {
            res.render("dashboard.ejs", { username: null, helpers: ejsHelpers });
        }
    } else {
      res.render("dashboard.ejs", { username: null, helpers: ejsHelpers });
    }
  } else {
    res.render("dashboard.ejs", { username: null, helpers: ejsHelpers });
  }
};

const createAccount = async (req, res) => {
  const username = req.body.username.replace(/[^a-zA-Z ]| /g, "");
  if (username.length < req.body.username.length) {
    await res.json({ error: "Illegal characters used" });
  }
  if (username.length >= 3 && req.body.password.length >= 4) {
    if (await db.addUser(username, req.body.password)) {
      req.session.username = username;
      req.session.password = req.body.password;
      await res.json({ username: username });
      chat.addClient(req.body.socket, username, io);
    } else {
      req.session.username = username;
      req.session.password = req.body.password;
      await res.json({ error: "Username already taken" });
    }
  } else if (username.length <= 3) {
    await res.json({ error: "Username too short" });
  } else if (req.body.password.length <= 4) {
    await res.json({ error: "Password too short" });
  }
};

const loginAccount = async (req, res, io) => {
  if (req.body.password) {
    if (await db.login(req.body.username, req.body.password)) {
      req.session.username = req.body.username;
      req.session.password = req.body.password;
      await res.json({ username: req.body.username });
      chat.getLastMessages(req.body.socket,io);
      chat.addClient(req.body.socket, req.body.username, io);
    } else {
      req.session.username = req.body.username;
      req.session.password = req.body.password;
      await res.json({ error: "Wrong username or password" });
    }
  } else {
    if (req.body.username && req.body.username.length >= 3) {
      const username = req.body.username.replace(/[^a-zA-Z ]| /g, "");
      if (username.length < req.body.username.length) {
        await res.json({ error: "Illegal characters used" });
      } else {
        req.session.username = req.body.username + "_guest";
        req.session.password = "";
        await res.json({ username: req.session.username });
        chat.addClient(req.body.socket, req.session.username, io);
        chat.getLastMessages(req.body.socket,io);
      }
    } else {
      res.json({ error: "Username does not meet standards" });
    }
  }
};

const users = (req, res) => {
  db.getAllUsers().then(r => {
    res.render("index", { data: r });
  });
};

module.exports = {
  home,
  createAccount,
  loginAccount,
  users
};
