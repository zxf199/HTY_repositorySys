import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      component: resolve => require(['@/components/index'], resolve),
      children: [
        {
          path: '',
          name: 'mainPage',
          component: resolve => require(['@/components/mainPage'], resolve)
        },
        {
          path: '/mac/macInput',
          name: 'macInput',
          component: resolve => require(['@/components/machine/macInput'], resolve)
        },
        {
          path: '/mac/macOutput',
          name: 'macOutput',
          component: resolve => require(['@/components/machine/macOutput'], resolve)
        },
        {
          path: '/mac/macType',
          name: 'macType',
          component: resolve => require(['@/components/machine/macType'], resolve)
        },
        {
          path: '/mac/macList',
          name: 'macList',
          component: resolve => require(['@/components/machine/macList'], resolve)
        },
        {
          path: '/drug/clientInfo',
          name: 'clientInfo',
          component: resolve => require(['@/components/drug/clientInfo'], resolve)
        },
        {
          path: '/drug/productInfo',
          name: 'productInfo',
          component: resolve => require(['@/components/drug/productInfo'], resolve)
        },
        {
          path: '/drug/drugInput/inputApply',
          name: 'inputApply',
          component: resolve => require(['@/components/drug/drugInput/inputApply'], resolve)
        },
        {
          path: '/drug/drugInput/checkApply',
          name: 'checkApply',
          component: resolve => require(['@/components/drug/drugInput/checkApply'], resolve)
        },
        {
          path: '/drug/drugInput/inputLog',
          name: 'inputLog',
          component: resolve => require(['@/components/drug/drugInput/inputLog'], resolve)
        },
        {
          path: '/drug/drugOutput/apply',
          name: 'apply',
          component: resolve => require(['@/components/drug/drugOutput/apply'], resolve)
        },
        {
          path: '/drug/drugOutput/audit',
          name: 'audit',
          component: resolve => require(['@/components/drug/drugOutput/audit'], resolve)
        },
        {
          path: '/drug/drugOutput/outputLog',
          name: 'outputLog',
          component: resolve => require(['@/components/drug/drugOutput/outputLog'], resolve)
        },
        {
          path: '/drug/drugOutput/output',
          name: 'drugOutput',
          component: resolve => require(['@/components/drug/drugOutput/drugOutput'], resolve)
        },
        {
          path: '/parts/partsInput/partsInput',
          name: 'partsInput',
          component: resolve => require(['@/components/parts/partsInput/partsInput'], resolve)
        },
        {
          path: '/parts/partsOutput/partsOutput',
          name: 'partsOutput',
          component: resolve => require(['@/components/parts/partsOutput/partsOutput'], resolve)
        },
        {
          path: '/parts/partsOutput/partsApply',
          name: 'partsApply',
          component: resolve => require(['@/components/parts/partsOutput/partsApply'], resolve)
        },
        {
          path: '/parts/partsOutput/partsAudit',
          name: 'partsAudit',
          component: resolve => require(['@/components/parts/partsOutput/partsAudit'], resolve)
        },
        {
          path: '/parts/partsOutput/partsAuditLog',
          name: 'partsAuditLog',
          component: resolve => require(['@/components/parts/partsOutput/partsAuditLog'], resolve)
        },
        {
          path: '/parts/partList',
          name: 'partList',
          component: resolve => require(['@/components/parts/partList'], resolve)
        },
        {
          path: '/parts/staticData',
          name: 'staticData',
          component: resolve => require(['@/components/parts/staticData'], resolve)
        }
      ]
    },
    {
      path: '*',
      redirect: {name: 'index'}
    }
  ]
})
export const asyncRouterMap = [
  {
    path: '/test',
    name: 'test',
    component: () => import('@/components/test.vue'),
    meta: {
      title: '权限控制',
      roles: ['admin'],
      keepAlive: false
    }
  }
]
