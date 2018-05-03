import Vue from 'vue';
import Router from 'vue-router';

import pollsRoutes from '../polls/router';
import userRoutes from '../user/router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: { name: 'user-polls' }
    },
    {
      path: '/polls',
      component: () => import(/* webpackChunkName: "polls-chunk" */ '@/polls'),
      children: pollsRoutes
    },
    {
      path: '/user',
      component: () => import(/* webpackChunkName: "user-chunk" */ '@/user'),
      children: userRoutes
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});
