const chat = require("./chatManager");

const manager = function(socket, io){
    socket.on("disconnect", function() {
        chat.disconnect(socket.id);
    });

    socket.on("chatMessage", function(data) {
        chat.msg(socket.id, data.message, io);
    });

    socket.on('login', function (username) {
        chat.addClient(socket.id,username);
    });
    socket.on('loginAccount',function(data){
        console.log(data.username, data.password);
        chat.login(socket.id, io, data.username, data.password);
    })
};

module.exports = {
    manager: manager
};