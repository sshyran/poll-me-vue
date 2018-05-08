import Vue from 'vue';
import Router from 'vue-router';
import Component from 'vue-class-component';

import i18nGuard from './i18n.guard';
import pollsRoutes from '../polls/router';
import userRoutes from '../user/router';

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
]);

Vue.use(Router);

const routerObject = new Router({
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

routerObject.beforeResolve(i18nGuard);

export default routerObject;
