// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

Vue.config.productionTip = false;
Vue.prototype.$user = {
  username: 'not logged in!'
};
Vue.prototype.$server = 'http://192.168.250.60:3300/';


export const SocketInstance = SocketIO('http://192.168.250.60:3300/');

Vue.use(new VueSocketIO({
    debug: true,
    connection: SocketInstance //options object is Optional
  })
);


new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
