const player = new Plyr("#player", {
  clickToPlay: false,
  autoplay: true,
  listeners: {
    seek: function(e) {
      e.preventDefault();
      return false;
    },
    play: function(e) {
      e.preventDefault();
      return false;
    }
  },
  keyboard: {
    focused: false,
    global: false
  },
  controls: [
    "play",
    "progress",
    "current-time",
    "mute",
    "volume",
    "captions",
    "pip",
    "fullscreen"
  ]
});

$(".plyr").click(function(e) {
  if (e.target == $(".plyr__controls__item")[0]) {
    playSocket();
  }

  if (e.target === $('input[data-plyr ="seek"]')[0]) {
    let percent = $('input[data-plyr ="seek"]').attr("seek-value") / 100;
    let videoLength = $('input[data-plyr ="seek"]').attr("aria-valuemax");
    seekSocket(percent * videoLength);
  }
});

$(".plyr").keydown(function(e) {
  if (e.key === "k" || e.key === "K" || e.key === "Space") {
    playSocket();
  } else if (e.key === "ArrowRight") {
    seekKeySocket(10);
  } else if (e.key === "ArrowLeft") {
    seekKeySocket(-10);
  }
});

function playSocket() {
  if (player.playing === false) {
    playing = true;
  } else {
    playing = false;
  }
  socket.emit("player", {
    playing: playing,
    position: player.currentTime,
    source: player.source
  });
}
function seekKeySocket(offset) {
  if (player.playing === false) {
    playing = false;
  } else {
    playing = true;
  }
  socket.emit("player", {
    playing: playing,
    position: player.currentTime + offset,
    source: player.source
  });
}
function seekSocket(time) {
  if (player.playing === false) {
    playing = false;
  } else {
    playing = true;
  }
  socket.emit("player", {
    playing: playing,
    position: time,
    source: player.source
  });
}
socket.on("playing", function(data) {
  setPlayer(data);
});

player.on("ended", function() {
  socket.emit("player", {
    playing: false,
    position: 0,
    source: player.source
  });
});

function setPlayer(data) {
  if (player.source !== data.source) {
    changeSource(data.source, data.position);
  }
  do {
    if (data.playing === true && player.playing === false && player.ready) {
      setTimeout(() => {
        player.play();
      }, 100);
    } else if (
      data.playing === false &&
      player.playing === true &&
      player.ready
    ) {
      setTimeout(() => {
        player.pause();
      }, 100);
    }
    if (player.currentTime !== data.position && player.ready) {
      setTimeout(() => {
        player.currentTime = data.position;
      }, 1000);
    }
  } while (!player.ready);
}

socket.on("watch", function(data) {
  changeSource(data.watch);
  socket.emit("player", {
    playing: true,
    position: 0,
    source: data.watch
  });
  setTimeout(() => {
    $(".plyr__controls").css("opacity", 100);
  }, 2000);
});

function changeSource(source) {
  let provider = "";
  if (source.includes("vimeo")) {
    provider = "vimeo";
  } else {
    provider = "youtube";
  }
  player.source = {
    type: "video",
    sources: [
      {
        src: `${source}`,
        provider: provider
      }
    ]
  };
}

$(window).bind("load", function() {
  setTimeout(() => {
    socket.emit("getPlayerInfo");
    console.log(player.source);
    let atag = `<a href='${player.source}'>${player.source}</a>`;
    $("#playertitle").html(atag);
  }, 1000);
});
socket.on("playerInfo", function(data) {
  setPlayer(data);
  setTimeout(() => {
    $(".plyr__controls").css("opacity", 100);
  }, 2000);
});