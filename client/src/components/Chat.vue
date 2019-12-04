<template>
  <div class="wrapper">
    <div id="chatBoxDiv" class="container">
      <div @click="play" id="output">
        <p v-for="messageNew in Arraymessages" v-html="messageNew"></p>
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
</template>

<script>
    export default {
        name: "Chat",
        props: {
            Arraymessages: Array
        },
        data() {
            return {
                messageInput: ''
            }
        },
        methods: {
            send: function () {
                this.$socket.emit('chatMessage',{
                    message: this.messageInput
                });
                this.messageInput = '';
            },
            play: function () {

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
