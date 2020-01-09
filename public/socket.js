socket.on("modal", function() {
    $("#modal-body").html(
        '<div style="padding:75% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/148751763?autoplay=1&loop=1&color=c9ff23&title=0&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>'
    );
    $("#exampleModal").modal("show");
});

socket.on("chatUpdate",function (data) {
    $('#clients').html("");
    console.log(data.clients);
    data.clients.forEach((client)=>{
        $('#clients').append("<p>"+client+"</p>");
    });
    data.messages.forEach(message=>{
        $("#output").append(
            $("<p>")
                .append($("<strong>").text(message.sender + ": "))
                .append($("<span>").html(message.message))
        );
    });
});

socket.on("rickroll", function() {
    window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
});

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