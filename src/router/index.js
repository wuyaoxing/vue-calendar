import Vue from 'vue'
import Router from 'vue-router'

import calendar from '../views/calendar'

Vue.use(Router)

export default new Router({
  mode: 'history',
  saveScrollPosition: true,
  routes: [
    {
      path: '/',
      name: 'index',
      component: calendar
    },
    {
      path: '*',
      component: calendar
    }
  ]
})
