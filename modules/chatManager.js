const command = require("./commands");
const stripHtml = require("string-strip-html");
const anchorme = require("anchorme").default;
const db = require('../db/db');

//Object Client
let Client = function (socketid, name) {
    let id = socketid;
    let username = name;
    this.getId = function () {
        return id;
    };
    this.getUsername = function () {
        return username;
    }
};

//Array with clients
let clients = [];

let msg = function (fromId, rawMessage, io) {
    //Uses stripHtml to remove all html tags and then uses anchrome to put <a> around links
    const message = anchorme(stripHtml(rawMessage));

    if (typeof clients[fromId] == 'undefined') {
        io.to(fromId).emit('chatMessage', {
            message: 'authorization needed',
            username: 'system'
        });
    } else {
        //checks for /msg
        if (rawMessage.startsWith('/')) {
            switch (rawMessage.split(" ")[0]) {
                case '/msg':
                    command.private(fromId, message, io, clients);
                    break;
                case '/rickroll':
                    command.rickroll(fromId, message, io, clients);
                    break;
                case '/clients':
                    command.users(fromId, message, io, clients);
                    break;
                case '/modal':
                    command.modal(fromId, message, io, clients);
                    break;
            }
        } else {
            const message = anchorme(stripHtml(rawMessage));
            io.emit("chatMessage", {
                message: message,
                username: clients[fromId].getUsername()
            });
        }
    }
};

const addClient = function (socketid, username, io) {
        username = username.replace(/ |:/g, '');
        username = stripHtml(username);
        clients[socketid] = new Client(socketid, username);
        console.log("New user: " + clients[socketid].getUsername() + " " + clients[socketid].getId());
        updateClientList(clients,io);
};

const updateClientList = (clients,io) => {
    let clientList = [];
    Object.keys(clients).forEach(function (id) {
        clientList.push(clients[id].getUsername());
    });
    io.emit("chatUpdate", {
        clients: clientList
    });
    console.log(clients);
};

const disconnectClient = function (socketid,io) {
    if (clients[socketid]) {
        console.log("Removed user: " + socketid);
        delete clients[socketid];
        updateClientList(clients,io)
    }
};

async function logintoDB(socketid, io, username, password) {
    let login = await db.login(username, password);
    if (login) {
        console.log(username + " logged in: " + login);
        addClient(socketid, username);
        io.to(socketid).emit('loginAccount', true);
    } else {
        io.to(socketid).emit('loginAccount', false);
    }
}

async function createUserDB(socketid, io, username, password) {
    // username = username.replace(/[ :?]/g, '');
    console.log(username);
    if (typeof username !== 'undefined' || username.length > 3) {
        console.log('hej');
        let test = await db.addUser(username, password);
        console.log(test);
        if (test) {
            io.to(socketid).emit('createAccount', true);
            addClient(socketid, username);
        } else {
            io.to(socketid).emit('createAccount', false);
        }
    }
}

module.exports = {
    msg: msg,
    addClient: addClient,
    disconnect: disconnectClient,
    login: logintoDB,
    createUser: createUserDB
};