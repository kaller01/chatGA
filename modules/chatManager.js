const command = require("./commands");
const dev = require("./dev");
const stripHtml = require("string-strip-html");
const anchorme = require("anchorme").default;
const db = require("../db/db");
const linkPreview = require("./link");

//Object Client
let Client = function (socketid, name) {
    let id = socketid;
    let username = name;
    let room;
    this.getId = function () {
        return id;
    };
    this.getUsername = function () {
        return username;
    };
    this.getRoom = ()=>{
        return room;
    };
    this.setRoom = (input)=>{
      room = input;
    }
};

//Array with clients
let clients = [];

let msg = function (fromId, data, io, socket) {
    //Uses stripHtml to remove all html tags and then uses anchrome to put <a> around links
    const rawMessage = data.message;
    const message = anchorme(stripHtml(rawMessage));

    if (typeof clients[fromId] == "undefined") {
        io.to(fromId).emit("chatMessage", {
            message: "authorization needed",
            sender: {
                username: "system"
            },
            receiver: {
                username: "all"
            }
        });
    } else {
        //checks for /msg
        if (rawMessage.startsWith("/")) {
            const wordsInMessage = rawMessage.split(" ");
            switch (wordsInMessage[0]) {
                case "/msg":
                    command.private(fromId, message, io, clients);
                    break;
                case "/rickroll":
                    command.rickroll(fromId, message, io, clients);
                    break;
                case "/clients":
                    command.users(fromId, message, io, clients);
                    break;
                case "/modal":
                    command.modal(fromId, message, io, clients);
                    break;
                case "/watch":
                    command.watch(fromId, rawMessage, io, clients);
                    break;
                case "/pong":
                        getIdFromUsername(wordsInMessage[1]).then(id=>{
                            command.pong({
                                socket,
                                id,
                                io,
                                clients
                            });
                        });
                    break;
            }
        } else {
            const message = anchorme(stripHtml(rawMessage));
            const channel = "chatMessage";
            const messagedata = {
                message,
                sender: {
                    username: clients[fromId].getUsername(),
                },
                receiver: {
                    username: data.receiver,
                },
            };
            console.log(data.receiver);
            if (data.receiver !== "all") {
                //lops through each client and checks username
                const receiver = data.receiver;
                Object.keys(clients).forEach(function (id) {
                    if (clients[id].getUsername() === receiver) {
                        const sockets = io.to(id).to(fromId);
                        sockets.emit(channel, messagedata);
                        linkPreview.messageToLink(message, sockets).catch(e => {
                        });
                    }
                });
            } else {
                io.emit(channel, messagedata);
                linkPreview.messageToLink(message, io).catch(e => {
                });
            }

            if (dev.logMessages) {
                let fromUser = clients[fromId].getUsername();
                let date = Date.now();
                db.addMessage(fromUser, data.receiver, message, date);
            }
        }
    }
};

const addClient = function (socketid, username, io) {
    clients[socketid] = new Client(socketid, username);
    // console.log("New user: " + clients[socketid].getUsername() + " " + clients[socketid].getId());
    updateClientList(clients, io);
};

const updateClientList = async (clients, io) => {
    let clientList = [];
    Object.keys(clients).forEach(function (id) {
        clientList.push(clients[id].getUsername());
    });
    io.emit("chatUpdate", {
        clients: clientList
    });
    // console.log(clients);
};

const getLastMessages = async (id, io, sender = null, to = "all") => {
    if (sender) {
        const messages = await db.getLastMessages("all");
    }
    const messages = await db.getLastMessages("all");
    io.to(id).emit("lastMessages", {
        messages
    });
};

const disconnectClient = function (socketid, io) {
    if (clients[socketid]) {
        // console.log("Removed user: " + socketid);
        delete clients[socketid];
        updateClientList(clients, io);
    }
};

async function logintoDB(socketid, io, username, password) {
    let login = await db.login(username, password);
    if (login) {
        // console.log(username + " logged in: " + login);
        addClient(socketid, username);
        io.to(socketid).emit("loginAccount", true);
    } else {
        io.to(socketid).emit("loginAccount", false);
    }
}

async function createUserDB(socketid, io, username, password) {
    // username = username.replace(/[ :?]/g, '');
    // console.log(username);
    if (typeof username !== "undefined" || username.length > 3) {
        let added = await db.addUser(username, password);
        // console.log(added);
        if (added) {
            io.to(socketid).emit("createAccount", true);
            addClient(socketid, username);
        } else {
            io.to(socketid).emit("createAccount", false);
        }
    }
}

const getIdFromUsername = (username) => {
    return new Promise(resolve=>{
        console.log(clients);
        Object.keys(clients).forEach(function (id) {
            console.log(clients[id].getUsername(), username);
            if (clients[id].getUsername() === username) {
                console.log('INVITED ID 1',id);
                resolve(id);
            }
        });
    });
};


module.exports = {
    msg,
    addClient: addClient,
    disconnect: disconnectClient,
    login: logintoDB,
    createUser: createUserDB,
    getLastMessages
};
