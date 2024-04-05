import Vue from 'vue'
import Router from 'vue-router'
import DiscoverMusic from '@/components/DiscoverMusic'
import MVBF from '@/components/MVBF'
import ShouSuo from '@/components/ShouSuo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DiscoverMusic',
      component: DiscoverMusic
    }, {
      path: '/MVBF',
      name: "MVBF",
      component: MVBF
    },{
      path: '/ShouSuo',
      name: "ShouSuo",
      component: ShouSuo
    }
  ]
})
