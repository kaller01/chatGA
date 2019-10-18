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
//Dummy data
//clients[223] = new Client(123, 'Dan123');

let msg = function(fromId, message, io) {

    //checks for /msg
    if(message.startsWith('/msg')){

        //gets the receiver
        let receiver = message.split(/\s+/)[1];

        //lops through each client and checks username
        Object.keys(clients).forEach(function (id) {
            console.log(clients[id].getUsername());
            if(clients[id].getUsername()===receiver){
                console.log('true');
                message = message.replace('/msg '+receiver, '');
                //sends the message
                io.to(clients[id].getId()).emit('chatMessage',{
                    message: message,
                    username: clients[fromId].getUsername(),
                    private: 'to'
                });
                io.to(fromId).emit('chatMessage',{
                    message: message,
                    username: clients[fromId].getUsername(),
                    private: 'from',
                    receiver: clients[id].getUsername()
                });
            }
        });
        //if it isnt private message
    }else if(message.startsWith('/rickroll')){
        let receiver = message.split(/\s+/)[1];
        Object.keys(clients).forEach(function (id) {
            if (clients[id].getUsername() === receiver) {
                io.to(clients[id].getId()).emit('rickroll');
            }
        });
    }else if(message.startsWith('/clients')){
        console.log(clients);
        let data="";
        Object.keys(clients).forEach(function (id) {
           data+=clients[id].getUsername()+", ";
        });
        io.to(fromId).emit('chatMessage',{
            message: data,
            username: "system",
        });
    } else {
        io.emit("chatMessage", {
            message: message,
            username: clients[fromId].getUsername()
        });
    }
};

const addClient = function(socketid, username){
    clients[socketid] = new Client(socketid, username);
    console.log("New user: "+clients[socketid].getUsername()+" "+clients[socketid].getId());
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