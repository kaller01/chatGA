const challenge = function(fromId, message, io, clients) {
  let receiver = message.split(/\s+/)[1];
  Object.keys(clients).forEach(function(id) {
    if (clients[id].getUsername() === receiver) {
      io.to(id).emit("chatMessage", {
        message: "",
        username: "You've been challenged by " + clients[fromId].getUsername()
      });
      io.to(fromId).emit("chatMessage", {
        message: "",
        username: "You've have challenged " + receiver
      });
    }
  });
};

const rickroll = function(fromId, message, io, clients) {
  let receiver = message.split(/\s+/)[1];
  Object.keys(clients).forEach(function(id) {
    if (clients[id].getUsername() === receiver) {
      io.to(clients[id].getId()).emit("rickroll");
    }
  });
};

const modal = function(fromId, message, io, clients) {
  let receiver = message.split(/\s+/)[1];
  Object.keys(clients).forEach(function(id) {
    if (clients[id].getUsername() === receiver) {
      io.to(clients[id].getId()).emit("modal");
    }
  });
};
const watch = function(fromId, message, io, clients) {
  let watchId = message.split(/\s+/)[1];
  io.emit("watch", {
    watch: watchId
  });
};

const showConnectedUsers = function(fromId, message, io, clients) {
  // console.log(clients);
  let data = "";
  Object.keys(clients).forEach(function(id) {
    data += clients[id].getUsername() + ", ";
  });
  io.to(fromId).emit("chatMessage", {
    message: data,
    username: "system"
  });
};

const privateMessage = function(fromId, message, io, clients) {
  //gets the receiver
  let receiver = message.split(/\s+/)[1];
  //lops through each client and checks username
  Object.keys(clients).forEach(function(id) {
    // console.log(clients[id].getUsername());
    if (clients[id].getUsername() === receiver) {
      // console.log('true');
      message = message.replace("/msg " + receiver, "");
      //sends the message
      io.to(clients[id].getId()).emit("chatMessage", {
        message: message,
        username: clients[fromId].getUsername(),
        private: "to"
      });
      io.to(fromId).emit("chatMessage", {
        message: message,
        username: clients[fromId].getUsername(),
        private: "from",
        receiver: clients[id].getUsername()
      });
    }
  });
};

const getSocketByUsername = (username, clients) => {
  return new Promise(resolve => {
    Object.keys(clients).forEach(function(id) {
      if (clients[id].getUsername() === username) {
        resolve(id);
      }
    });
    resolve(false);
  });
};

const getUsernameBySocket = (socket, clients) => {
  return clients[socket];
};

module.exports = {
  challenge: challenge,
  rickroll,
  users: showConnectedUsers,
  private: privateMessage,
  modal,
  watch,
  getSocketByUsername,
  getUsernameBySocket
};
