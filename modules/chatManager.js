const command = require("./commands");
const stripHtml = require("string-strip-html");
const anchorme = require("anchorme").default;

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
    if(typeof username == 'undefined' || username.length < 4){
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

module.exports = {
    msg: msg,
    addClient: addClient,
    disconnect: disconnectClient
};