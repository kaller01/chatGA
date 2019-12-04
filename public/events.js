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

$("#exampleModal").on("click", function(e) {
    $("#modal-body").html("");
    $("#exampleModal").modal("hide");
});