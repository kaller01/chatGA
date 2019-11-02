const chat = require("./chatManager");

const manager = function(socket, io){
    socket.on("disconnect", function() {
        chat.disconnect(socket.id);
    });
    socket.on("chatMessage", function(data) {
        chat.msg(socket.id, data.message, io);
    });
    socket.on('login', function (username) {
        chat.addClient(socket.id,username+'_guest');
    });
    socket.on('loginAccount',function(data){
        chat.login(socket.id, io, data.username, data.password);
    });
    socket.on('createAccount',(data)=> {
        chat.createUser(socket.id,io,data.username,data.password);
    })
};

module.exports = {
    manager: manager
};