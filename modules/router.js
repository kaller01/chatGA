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
};

const createAccount = async (req,res)=>{
    if (await db.addUser(req.body.username, req.body.password)) {
        req.session.username = req.body.username;
        req.session.password = req.body.password;
        await res.json(req.body.username);
        chat.addClient(req.body.socket, req.body.username,io);
    } else {
        req.session.username = req.body.username;
        req.session.password = req.body.password;
        await res.json(false);
    }
};

const loginAccount = async (req,res,io)=>{
    if (req.body.password) {
        if (await db.login(req.body.username, req.body.password)) {
            req.session.username = req.body.username;
            req.session.password = req.body.password;
            await res.json(req.body.username);
            chat.getLastMessages(req.body.socket,io);
            chat.addClient(req.body.socket, req.body.username,io);
        } else {
            req.session.username = req.body.username;
            req.session.password = req.body.password;
            await res.json(false);
        }
    } else {
        console.log(req.body.username);
        if (req.body.username) {
            req.session.username = req.body.username + "_guest";
            req.session.password = "";
            await res.json(req.session.username);
            chat.addClient(req.body.socket, req.session.username,io);
            chat.getLastMessages(req.body.socket,io);
        } else {
            res.json(false);
        }
    }
};

const users = (req,res)=>{
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