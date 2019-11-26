<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <h1 class="navbar-brand" href="#" id="displayName">{{this.$user.username}}</h1>

      <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
        </ul>
        <ul class="navbar-nav my-2 my-lg-0">
          <button type="button" class="btn btn-primary mx-2" data-toggle="modal" data-target="#modalLogin">
            Log in
          </button>
          <button type="button" class="btn btn-success mx-2" data-toggle="modal" data-target="#modalCreate">
            Sign up
          </button>
          <button type="button" class="btn btn-secondary mx-2" data-toggle="modal" data-target="#modalGuest">
            Guest
          </button>
        </ul>
      </div>
    </nav>
    <div class="wrapper">
      <div id="chatBoxDiv" class="container">
        <div id="output">
          <p v-for="message in messages" v-html="message"></p>
        </div>
        <form class="input-group" id="chatForm">
          <input
            class="col-10"
            type="text"
            autocomplete="off"
            placeholder="message"
            required
            id="chatInput"
            maxlength="200"
            v-model="messageInput"
          />
          <button
            class="btn-primary col-2"
            id="chatSubmit"
            @click="send"
          >Send</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Chat",
        data() {
            return {
                messages: ['Connecting...'],
                messageInput: '',
                user: {
                    username: 'not logged in'
                }
            }
        },
        sockets: {
            connect: function () {
                this.messages.push('Connected to socket');
            },
            chatMessage: function (data) {
                console.log(this.$socket.id);
                this.messages.push(`<strong>${data.username}</strong>: ${data.message}`);
            }
        },
        methods: {
            send: function () {
                this.$socket.emit('chatMessage',{
                    message: this.messageInput
                });
                this.messageInput = '';
            }
        }
    }
</script>

<style scoped>
  .wrapper {
    display: flex;
    justify-content: center;
  }

  #output {
    height: 80vh;
    overflow: auto;
    white-space: pre-line;
    width: 100%;
    border: 1px solid black;
  }
  #output :nth-child(even) {
    background-color: #dddddd;
  }
  p {
    width: 100%;
    white-space: pre-line;
    word-wrap: break-word;
  }
  #chatForm {
    width: 100%;
  }

  #errorUsername {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    color: orange;
  }

  .buttonSelect{
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #startOverlay{
    display: flex;
  }

  .overlay {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: slategray;
    z-index: 10;
    display: none;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  #loginOverlay .container, #createOverlay .container, #guestOverlay .container{
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }

  .error{
    width: 100%;
    text-align: center;
    color:orange;
  }
</style>
