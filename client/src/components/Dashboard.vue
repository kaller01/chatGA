<template>
  <div>
    <Nav></Nav>
    <Chat :arraymessages="messages"></Chat>
    <Modal id="Login">
      <test/>
    </Modal>
    <Button id="Login"></Button>
  </div>
</template>

<script>
    import Nav from './Nav';
    import Chat from './Chat';
    import Modal from './LoginModal';
    import Button from './modalButton';
    import test from './test';
    export default {
        name: "Dashboard",
        data() {
            return {
                messages: ['Connecting...'],
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

        },
        components: {
            Nav,
            Chat,
            Modal,
            Button,
            test
        }
    }
</script>

<style scoped>

</style>
