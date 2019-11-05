//global $
let socket = io();

$('#username').bind('copy paste',function(e) {
  e.preventDefault(); return false;
});

let chatBoxDiv = document.getElementById("chatBoxDiv"),
  chatInput = document.getElementById("chatInput"),
  chatForm = document.getElementById("chatForm"),
  output = document.getElementById("output"),
  loginForm = document.getElementById("loginForm"),
  username = document.getElementById("username"),
  loginOverlay = document.getElementById("startOverlay"),
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
    // loginOverlay.style.display = "none";
    $('#guestOverlay').hide();
    socket.emit("login", usernameValue);
  } else {
    errorUsername.innerHTML = "Name must be between 3 and 20 characters long";
  }
});

function selectStart(id){
  $(id+'AccountButton').click(()=>{
    $('#startOverlay').hide();
    $(id+'Overlay').css('display', 'flex');
  });
}
function login(id,channel){
  function doStuff(){
    let username = $('#username'+id+'Input').val();
    if (username.length >= 3 && username.length <= 20) {
      let password = $('#password'+id+'Input').val();
      socket.emit(channel, {
        username: username,
        password: password
      });
    } else {
      alert('too short');
    }
  }
  $('#'+id).click(()=>{
    doStuff();
  });
}

selectStart('#create');
selectStart('#login');
selectStart('#guest');
login('create',"createAccount");
login('login',"loginAccount");


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
};

socket.on("chatMessage", function(data) {
  if(data.private){
    if(data.private==='to'){
      $("#output").append($('<p>').append($(('<strong>')).text(data.username + " whispers: ")).append($('<span>').html(data.message)));
    } else if(data.private==='from'){
      $("#output").append($('<p>').append($(('<strong>')).text(data.username + " to " + data.receiver + ": ")).append($('<span>').html(data.message)));
    }
  } else {
    $("#output").append($('<p>').append($(('<strong>')).text(data.username+": ")).append($('<span>').html(data.message)));
  }
  output.scrollBy({
    top: 1000
  });
});

socket.on('rickroll', function () {
  window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
});

socket.on('loginAccount',(accept)=>{
  if(accept){
    $('#loginOverlay').hide();
  } else {
    alert('wrong password');
  }
});

socket.on('createAccount',(accept)=>{
  if(accept){
    $('#createOverlay').hide();
  } else {
    alert('password already in use by "Admin"');
  }
});


function hideWhenOutside(id) {
  console.log(id);
  $(id).click((e)=>{
    console.log('yes');
    let container = $(id+'Container');
    console.log(container);
    if (!container.is(e.target) && container.has(e.target).length === 0)
    {
      console.log(true);
      $(id).hide();
      $('#startOverlay').css('display', 'flex');
    }
  });
}

hideWhenOutside('#createOverlay');
hideWhenOutside('#loginOverlay');
hideWhenOutside('#guestOverlay');