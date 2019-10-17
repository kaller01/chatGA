let socket = io();

let chatBoxDiv = document.getElementById("chatBoxDiv"),
  chatInput = document.getElementById("chatInput"),
  chatForm = document.getElementById("chatForm"),
  output = document.getElementById("output");

chatForm.addEventListener("submit", function(event) {
  event.preventDefault();
  socket.emit("chatMessage", {
    message: chatInput.value
  });
  chatInput.value = "";
});

socket.on("chatMessage", function(data) {
  output.innerHTML += "<p>" + data.message + "</p>";
  output.scrollBy({
    top: 1000
  });
});
