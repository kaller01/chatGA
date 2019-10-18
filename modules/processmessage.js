// //Object Client
// function Client(socketid, name){
//     let id=socketid;
//     let username=name;
//     this.getId = function () {
//         return id;
//     };
//     this.getUsername = function () {
//         return username;
//     }
// }
//
// //Array with clients
// let clients = [];
// //Dummy data
// clients.push(new Client(12345, "Bob"));
// clients.push(new Client(67891, "Dan"));
//
// let msg = function(fromId, message, io) {
//
//     //checks for /msg
//     if(message.startsWith('/msg')){
//
//         //gets the receiver
//         let receiver = message.split(/\s+/)[1];
//
//         //lops through each client and checks username
//         clients.forEach(function (client) {
//             if(client.getUsername()===receiver){
//                 //sends the message
//                 // io.to(client.getId()).emit('chat',message);
//                 console.log('c');
//
//             }
//         });
//         //if it isnt private message
//     } else {
//         // io.emit('chat', 'Private message: '+message);
//     }
// };
//
// msg(12345, '/msg Dan hi noob');
//
// module.exports = {
//     msg: msg
// };

//
// function compareClient(mode, text) {
//         if(mode==='id'){
//             //id to username
//             clients.forEach(function (client) {
//                 if(client.getId()==text) {
//                     const result = client.getUsername();
//                     return this.result;
//                 }
//             });
//         } else if(mode==='username'){
//             //username to id
//             clients.forEach(function (client) {
//                 if(client.getUsername()===text) {
//                     return client.getId();
//                 }
//             });
//         } else {
//             return false;
//         }
// }
//
// console.log(compareClient('id','12345'));