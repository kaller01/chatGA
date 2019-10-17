const chat = require("./chatManager");

const manager = function(socket, io){
    console.log("user connected " + socket.id);
    socket.on("disconnect", function() {
        console.log("user disconnected");
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