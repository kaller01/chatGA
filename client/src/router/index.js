/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';
import Register from '@/components/Register';
import Dashboard from '@/components/Dashboard';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    }
  ]
})
