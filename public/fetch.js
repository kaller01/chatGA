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
  // console.log(json);
  if (json.username) {
    $("#modal" + id).modal("hide");
    $("#displayName").html(json.username);
    clientUsername = json.username;
    $("#chatForm").show();
    $("#error" + id).hide();
  } else if (json.error) {
    $("#error" + id).text(json.error);
    $("#error" + id).show();
  }
}

const getLastMessages = async () => {
  const url = "/api/messages/";
  const data = {};
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
  const response = await fetch(url, options);
  const json = await response.json();
  // console.log(json);
};
