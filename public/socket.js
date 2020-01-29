let conversations = [];


socket.on("modal", function () {
    $("#modal-body").html(
        '<div style="padding:75% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/148751763?autoplay=1&loop=1&color=c9ff23&title=0&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>'
    );
    $("#exampleModal").modal("show");
});

socket.on("chatUpdate", function (data) {
    $('#clients').html("");
    console.log(data.clients);
    data.clients.forEach((client) => {
        $('#clients').append(`<p class="d-flex justify-content-between">${client}<span class="btn btn-outline-primary btn-sm" id="${client}-action>" onclick="newConversation('${client}')">Chat</span></p>`);
    });
});

socket.on("lastMessages", data => {
    $('#output').html("");
    data.messages.reverse();
    data.messages.forEach(message => {
        $("#output").append(
            $("<p>")
                .append($("<strong>").text(message.sender + ": "))
                .append($("<span>").html(message.message))
        );
    });
});

socket.on("rickroll", function () {
    window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
});

socket.on("chatMessage", function (data) {
    if (data.private) {
        if (data.private === "to") {
            newConversation(data.username);
            $("#"+data.username+"-output").append(
                $("<p>")
                    .append($("<strong>").text(data.username + ": "))
                    .append($("<span>").html(data.message))
            );
        } else if (data.private === "from") {
            $("#"+data.receiver+"-output").append(
                $("<p>")
                    .append($("<strong>").text(data.username + ": "))
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

const newConversation = username => {
    if(!conversations.includes(username)){
        conversations.push(username);
        console.log(conversations);
        $("#tabs").append(
            `<li class="nav-item" id="${username}-tab-li">
                    <a class="nav-link" id="${username}-tab" data-toggle="tab" href="#${username}-chat" role="tab"
                       aria-controls="profile" aria-selected="false">
                        <div class="d-flex justify-content-between">
                            <div><span class="badge badge-danger">7</span> ${username} </div>
                            <button type="button" class="close ml-3" aria-label="Close" onclick="removeConversation('${username}')">
                                <span>&times;</span>
                            </button>
                        </div>
                    </a>
        </li>`
        );
        $("#chats").append(
            `<div class="tab-pane fade chat" id="${username}-chat" role="tabpanel" aria-labelledby="${username}-tab"><div id="${username}-output"></div></div>`
        );
        $('#' + username + '-tab').tab('show');
    }
};

const removeConversation = username =>{
    console.log(username);
    $(`#${username}-tab-li`).remove();
    $(`#${username}-chat`).remove();
    conversations.forEach((user, index)=>{
        if(user === username){
            conversations.splice(index,1);
        }
    });
    $('#all-tab').tab('show');
};