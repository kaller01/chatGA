let sendTo = "all";

window.addEventListener("DOMSubtreeModified",()=>{
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        let user = e.target.attributes.id.value.replace("-tab","");
        if(sendTo!==user){
            console.log("Changeconvo", user);
            sendTo=user;
        }
    });
});

chatForm.addEventListener("submit", function (event) {
    event.preventDefault();
    // const user = $("#chatInput2").val();
    const user = sendTo;
    let message = chatInput.value;
    if (user === 'all') {
        socket.emit("chatMessage", {
            message
        });
    } else {
        message = "/msg " + user + " " + message;
        newConversation(user);
        socket.emit("chatMessage", {
            message,
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

$("#exampleModal").on("click", function (e) {
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




