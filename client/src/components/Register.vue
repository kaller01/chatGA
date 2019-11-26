<template>
  <div class="hello">
    <h1>Register</h1>
    <input type="text" name="username" placeholder="Username" v-model="username">
    <input type="password" name="password" v-model="password">
    <br>
    <button @click="register">Register</button>
  </div>
</template>

<script>
    import AuthenticationService from "G:/code/node/client/services/AuthenticationService.js";

    export default {
        data() {
            return {
                username: 'abc',
                password: '123'
            }
        },
        sockets: {
            connect: function () {
                console.log('socket connected');
            }
        },
        methods: {
            async register() {
                const response = await AuthenticationService.register({
                    username: this.username,
                    password: this.password,
                    socket: this.$socket.id
                });
                console.log(response.data);
                this.$user.username = response.data;
            }
        }
    }
</script>

