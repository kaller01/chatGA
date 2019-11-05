const command = require("./commands");
const stripHtml = require("string-strip-html");
const anchorme = require("anchorme").default;
const db = require('../db/db');

//Object Client
let Client =function(socketid, name){
    let id=socketid;
    let username=name;
    this.getId = function () {
        return id;
    };
    this.getUsername = function () {
        return username;
    }
};

//Array with clients
let clients = [];

let msg = function(fromId, rawMessage, io) {
    //Uses stripHtml to remove all html tags and then uses anchrome to put <a> around links
    const message = anchorme(stripHtml(rawMessage));

    if(typeof clients[fromId] == 'undefined'){
        clients[fromId] = new Client(fromId, fromId);
        io.emit("chatMessage", {
            message: message,
            username: clients[fromId].getUsername()
        });
    }else{
    //checks for /msg
    if(message.startsWith('/msg')){
        command.private(fromId, message, io, clients);
        //if it isnt private message
    }else if(message.startsWith('/rickroll')){
        command.rickroll(fromId, message, io, clients);

    }else if(message.startsWith('/clients')){
        command.users(fromId, message, io, clients);

    } else if(message.startsWith('/challenge')){
        command.challenge(fromId, message, io, clients);

    }else {
        io.emit("chatMessage", {
            message: message,
            username: clients[fromId].getUsername()
        });
    }
}
};

const addClient = function(socketid, username){
    if(typeof username == 'undefined' || username.length < 3){
        username = socketid + "";
        clients[socketid] = new Client(socketid, username);
    }else{
    username = username.replace(/ |:/g, '');
    clients[socketid] = new Client(socketid, username);
    console.log("New user: "+clients[socketid].getUsername()+" "+clients[socketid].getId());
    }
};

const disconnectClient = function(socketid){
    console.log("Removed user: "+socketid);
  delete clients[socketid];
};

async function logintoDB(socketid,io,username,password){
    let login = await db.login(username,password);
    if(login){
        console.log(username+" logged in: " +login);
        addClient(socketid, username);
        io.to(socketid).emit('loginAccount',true);
    } else {
        io.to(socketid).emit('loginAccount',false);
    }
}

async function createUserDB(socketid,io,username,password){
    username = username.replace(/[ :?]/g, '');
    console.log(username);
    if(typeof username == 'undefined' || username.length < 3){
        let test = await db.addUser(username,password);
        if(test){
            io.to(socketid).emit('createAccount',true);
            addClient(socketid, username);
        } else {
            io.to(socketid).emit('createAccount',false);
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