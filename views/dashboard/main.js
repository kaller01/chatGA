/* global $ */

let socket = io();
let sessionId;
socket.on("connect", function() {
  sessionId = socket.id;
  console.log(sessionId);
});

let messageHistory = [];

async function login(url, username, password, id, error) {
  const data = { username: username, password: password, socket: sessionId };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
  const response = await fetch(url, options);
  const json = await response.json();
  console.log(json);
  if (json) {
    $("#modal" + id).modal("hide");
    $("#displayName").html(json);
    $("#chatForm").show();
    $("#error" + id).hide();
  } else {
    $("#error" + id).text(error);
    $("#error" + id).show();
  }
}

let chatBoxDiv = document.getElementById("chatBoxDiv"),
  chatInput = document.getElementById("chatInput"),
  chatForm = document.getElementById("chatForm"),
  output = document.getElementById("output"),
  loginForm = document.getElementById("loginForm"),
  username = document.getElementById("username"),
  loginOverlay = document.getElementById("startOverlay"),
  loginButton = document.getElementById("loginButton"),
  errorUsername = document.getElementById("errorUsername");

socket.on("chatMessage", function(data) {
  if (data.private) {
    if (data.private === "to") {
      $("#output").append(
        $("<p>")
          .append($("<strong>").text(data.username + " whispers: "))
          .append($("<span>").html(data.message))
      );
    } else if (data.private === "from") {
      $("#output").append(
        $("<p>")
          .append(
            $("<strong>").text(data.username + " to " + data.receiver + ": ")
          )
          .append($("<span>").html(data.message))
      );
    }
  } else {
    $("#output").append(
      $("<p>")
        .append($("<strong>").text(data.username + ": "))
        .append($("<span>").html(data.message))
    );
  }
  output.scrollBy({
    top: 1000
  });
});

chatForm.addEventListener("submit", function(event) {
  event.preventDefault();
  socket.emit("chatMessage", {
    message: chatInput.value,
    username: username.value
  });
  if (messageHistory[messageHistory.length - 1] !== chatInput.value) {
    messageHistory.push(chatInput.value);
  }
  messageNumber = messageHistory.length;
  chatInput.value = "";
});

$("#chatForm").keydown(e => {
  if (e.key === "ArrowUp") {
    if (messageNumber > 0) messageNumber--;
    console.log(messageNumber);
    chatInput.value = messageHistory[messageNumber];
  } else if (e.key === "ArrowDown") {
    if (messageNumber < messageHistory.length - 1 && messageNumber >= 0) {
      messageNumber++;
      chatInput.value = messageHistory[messageNumber];
    } else if (messageNumber === messageHistory.length - 1) {
      messageNumber++;
      chatInput.value = "";
    }
  }
});

socket.on("rickroll", function() {
  window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
});

$("#exampleModal").on("click", function(e) {
  $("#modal-body").html("");
  $("#exampleModal").modal("hide");
});

socket.on("modal", function() {
  $("#modal-body").html(
    '<div style="padding:75% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/148751763?autoplay=1&loop=1&color=c9ff23&title=0&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>'
  );
  $("#exampleModal").modal("show");
});
