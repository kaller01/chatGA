let socket = io();

let chatBoxDiv = document.getElementById("chatBoxDiv"),
  chatInput = document.getElementById("chatInput"),
  chatForm = document.getElementById("chatForm"),
  output = document.getElementById("output"),
  loginForm = document.getElementById("loginForm"),
  username = document.getElementById("username"),
  loginOverlay = document.getElementById("loginOverlay"),
  loginButton = document.getElementById("loginButton"),
  errorUsername = document.getElementById("errorUsername");

chatForm.addEventListener("submit", function(event) {
  event.preventDefault();
  socket.emit("chatMessage", {
    message: chatInput.value,
    username: username.value
  });
  chatInput.value = "";
});

loginButton.addEventListener("click", function(event) {
  if (username.value.length >= 3 && username.value.length <= 20) {
    loginOverlay.style.display = "none";
  } else {
    errorUsername.innerHTML = "Name must be between 3 and 20 characters long";
  }
});
username.addEventListener("keydown", function(event) {
  if (
    event.keyCode === 13 &&
    username.value.length >= 3 &&
    username.value.length <= 20
  ) {
    loginOverlay.style.display = "none";
  } else if (
    (username.value.length <= 3 && event.keyCode === 13) ||
    (username.value.length >= 20 && event.keyCode === 13)
  ) {
    errorUsername.innerHTML = "Name must be between 3 and 20 characters long";
  }
});

socket.on("chatMessage", function(data) {
  output.innerHTML +=
    "<p>" + "<strong>" + data.username + ":</strong> " + data.message + "</p>";
  output.scrollBy({
    top: 1000
  });
});
