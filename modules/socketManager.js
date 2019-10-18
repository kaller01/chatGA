const chat = require("./chatManager");

const manager = function(socket, io){
    socket.on("disconnect", function() {
        chat.disconnect(socket.id);
    });

    socket.on("chatMessage", function(data) {
        chat.msg(socket.id, data.username, data.message, io);
    });

    socket.on('login', function (username) {
        chat.addClient(socket.id,username);
    });
};

module.exports = {
    manager: manager
};