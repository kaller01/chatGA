const chat = require("./chatManager");


const manager = function(socket, io){
    socket.on("disconnect", function() {
        chat.disconnect(socket.id,io);
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
    });
    socket.on('player',function(data){
        playing = data.playing;
        position = data.position;
        source = data.source;
        io.emit('playing',{
            playing:data.playing,
            position:data.position,
            source:data.source
        });
    });
};

module.exports = {
    manager: manager
};