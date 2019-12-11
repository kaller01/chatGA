chatForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const user = $("#chatInput2").val();
    if(user==='all'){
        socket.emit("chatMessage", {
            message: chatInput.value
        });
    } else {
        socket.emit("message", {
            message: chatInput.value,
            channel: user
        });
    }

    if (messageHistory[messageHistory.length - 1] !== chatInput.value) {
        messageHistory.push(chatInput.value);
    }
    messageNumber = messageHistory.length;
    chatInput.value = "";
});

$("#chatForm").keydown(e => {
    if (e.key === "ArrowUp") {
        if (messageNumber > 0) messageNumber--;
        e.preventDefault();
        chatInput.value = messageHistory[messageNumber];
        setCaretPosition(chatInput, chatInput.value.length);
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

$("#exampleModal").on("click", function(e) {
    $("#modal-body").html("");
    $("#exampleModal").modal("hide");
});

function setCaretPosition(ctrl, pos) {
    // Modern browsers
    if (ctrl.setSelectionRange) {
      ctrl.focus();
      ctrl.setSelectionRange(pos, pos);
    
    // IE8 and below
    } else if (ctrl.createTextRange) {
      var range = ctrl.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }