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
}

//Array with clients
let clients = [];
//Dummy data
clients.push(new Client(67891, "Dan"));

let msg = function(fromId, fromUser, message, io) {

    //checks for /msg
    if(message.startsWith('/msg')){

        //gets the receiver
        let receiver = message.split(/\s+/)[1];
        console.log(receiver);

        //lops through each client and checks username
        clients.forEach(function (client) {
            if(client.getUsername()===receiver){
                console.log('true');
                //sends the message
                io.to(client.getId()).emit('chatMessage',{
                    message: message,
                    username: fromUser
                });
            }
        });
        //if it isnt private message
    } else {
        io.emit("chatMessage", {
            message: message,
            username: fromUser
        });
        console.log('c');
    }
};

module.exports = {
    msg: msg,
    clients: clients,
    Client: Client
};