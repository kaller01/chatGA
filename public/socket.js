let conversations = [];

socket.on("modal", function () {
    $("#modal-body").html(
        '<div style="padding:75% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/148751763?autoplay=1&loop=1&color=c9ff23&title=0&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>'
    );
    $("#exampleModal").modal("show");
});

socket.on("chatUpdate", function (data) {
    $("#clients").html("");
    console.log(data.clients);
    data.clients.forEach(client => {
        $("#clients").append(
            `<p class="d-flex justify-content-between">${client}<span class="btn btn-outline-primary btn-sm" id="${client}-action>" onclick="openNewConversation('${client}')">Chat</span></p>`
        );
    });
});

socket.on("lastMessages", data => {
    $("#output").html("");
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
    console.log(data);
    //checks if data is to all
    if (data.receiver.username === "all") {
        addNotifcations("all");
        showMessage(data, $("#output"));
      console.log("mode 1");
    } else {
        if (data.receiver.username === clientUsername) {
            newConversation(data.username);
            addNotifcations(data.username);
          console.log("mode 2");
            showMessage(data, $("#" + data.username + "-output"));
        } else {
          console.log("mode 3");
            showMessage(data, $("#" + data.receiver.username + "-output"));
        }
    }
    setTimeout(() => {
        $("a").attr("target", "_blank");
    }, 50);
    document.getElementsByClassName("tab-pane")[0].scrollBy({
        top: 1000
    });
});

socket.on("linkPreview", function (data) {
    const clientMessage = document.getElementsByClassName("messages");
    for (let index = 0; index < clientMessage.length; index++) {
        message = clientMessage[index].innerHTML;
        if (
            message
                .replace(/ |target="_blank"/g, "")
                .includes(data.message.replace(/ /g, "")) &&
            !message.includes(
                `<img class="card-img-right flex-auto d-none d-md-block previewImg" src="${data.img}">`
            )
        ) {
            clientMessage[index].innerHTML = `
      ${message}
      <div class="card previewDiv flex-md-row mb-4 box-shadow h-md-250">
      <div class="card-body d-flex flex-column align-items-start">
        <strong class="d-inline-block mb-2 text-primary"><a href="${
                data.link
            }" target="_blank">${data.title}</a></strong>
        <p class="card-text mb-auto">${data.description || data.title}</p>
        <a href="${data.link}" target="_blank">${data.domain}</a>
      </div>
      <img class="card-img-right flex-auto d-none d-md-block previewImg" src="${
                data.img
            }">
    </div>`;
            setTimeout(() => {
                document.getElementsByClassName("tab-pane")[0].scrollBy({
                    top: 4000
                });
            }, 50);
        }
    }
});

const openNewConversation = username => {
    newConversation(username);
    $("#" + username + "-tab").tab("show");

};

const newConversation = username => {
    if (!conversations.includes(username)) {
        conversations.push(username);
        console.log(conversations);
        $("#tabs").append(
            `<li class="nav-item tabchat"  id="${username}-tab-li">
                    <a class="nav-link" id="${username}-tab" data-toggle="tab" href="#${username}-chat" role="tab"
                       aria-controls="profile" aria-selected="false">
                        <div class="d-flex justify-content-between">
                            <div><span id="${username}-notification" class="badge badge-danger">0</span> ${username} </div>
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
    }
};

const removeConversation = username => {
    console.log(username);
    $(`#${username}-tab-li`).remove();
    $(`#${username}-chat`).remove();
    conversations.forEach((user, index) => {
        if (user === username) {
            conversations.splice(index, 1);
        }
    });
    $("#all-tab").tab("show");
};

const showMessage = (data, output) => {
    output.append(
        $("<p>")
            .append($("<strong>").text(data.username + ": "))
            .append(
                $("<span>")
                    .html(data.message)
                    .addClass("messages")
            )
    );
};