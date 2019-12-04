/* global $ */

let socket = io();
let sessionId;
socket.on("connect", function() {
  sessionId = socket.id;
  console.log(sessionId);
});

let messageHistory = [];



let chatBoxDiv = document.getElementById("chatBoxDiv"),
  chatInput = document.getElementById("chatInput"),
  chatForm = document.getElementById("chatForm"),
  output = document.getElementById("output"),
  loginForm = document.getElementById("loginForm"),
  username = document.getElementById("username"),
  loginOverlay = document.getElementById("startOverlay"),
  loginButton = document.getElementById("loginButton"),
  errorUsername = document.getElementById("errorUsername");








