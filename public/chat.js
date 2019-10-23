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
  usernameValue = username.value.replace(/ |:/g, '');
  if (usernameValue.length >= 3 && usernameValue.length <= 20) {
    loginOverlay.style.display = "none";
    socket.emit("login", usernameValue);
  } else {
    errorUsername.innerHTML = "Name must be between 3 and 20 characters long";
  }
});
username.addEventListener("keydown", function(event) {
  usernameValue = username.value.replace(/ |:/g, '');
  if (
    event.keyCode === 13 &&
    usernameValue.length >= 3 &&
    usernameValue.length <= 20
  ) {
    loginOverlay.style.display = "none";
    socket.emit("login", usernameValue);
  } else if (
    (usernameValue.length <= 3 && event.keyCode === 13) ||
    (usernameValue.length >= 20 && event.keyCode === 13)
  ) {
    errorUsername.innerHTML = "Name must be between 3 and 20 characters long";
  }
  if (event.keyCode === 32) return false;
});

let ignoreKey = function(event){
  let key = event.code;
  if(key === 'Space' || key === 'Period') return false;
}

socket.on("chatMessage", function(data) {
  if(data.private){
    if(data.private==='to'){
      output.innerHTML +=
          "<p>" + "<strong>" + data.username + " whispers:</strong> " + data.message + "</p>";
    } else if(data.private==='from'){
      output.innerHTML +=
          "<p>" + "<strong>" + data.username + " to " + data.receiver + ":</strong> " + data.message + "</p>";
    }
  } else {
    output.innerHTML +=
        "<p>" + "<strong>" + data.username + ":</strong> " + data.message + "</p>";
  }
  output.scrollBy({
    top: 1000
  });
});

socket.on('rickroll', function () {
  window.location.replace('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
});
