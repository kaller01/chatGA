const express = require('express');
const app = express();
const http = require('http').createServer(app);
const port=3350;
const hostname="192.168.250.60";
const io = require('socket.io')(http);
const dirPath ="/Users/markal307/WebstormProjects/test/";
const chat = require(__dirname+ '/modules/chat');

app.get('/', function (req, res){
   res.sendFile(__dirname + '/views/index.html');
});

app.use(express.static('public'));

io.on('connection', function (socket) {
    // chat.onConnect(socket);
   console.log('a user connected');
   socket.on('disconnect', function () {
       console.log('user disconnected');
   });
   socket.on('chat', function (msg) {
       console.log('message: '+msg);

       io.emit('chat', msg);
   });
});


http.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

for(let index; index < 10; index++) {

    if(true){
        index++;
    }

}

console.log(index);

