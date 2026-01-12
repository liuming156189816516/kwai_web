import Vue from 'vue'
import i18n from '@/locale'
import Router from 'vue-router'

Vue.use(Router)
/* Layout */
import Layout from '@/layout'

/* Router Modules */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/work-order-sharing',
    component: () => import('@/views/share/work-order-sharing'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/dashboard/index'),
        name: 'index',
        meta: { title: i18n.t('sys_m016'), icon: 'el-icon-odometer', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        hidden: true,
        path: '/user-info',
        component: () => import('@/views/user/user-info'),
        name: 'user-info',
        meta: { title: i18n.t('sys_m020'), icon: 'dashboard' }
      },
      {
        hidden: true,
        path: '/change-password',
        component: () => import('@/views/user/change-password'),
        name: 'change-password',
        meta: { title: i18n.t('sys_m021'), icon: 'dashboard' }
      }
    ]
  }
]
export const asyncRoutes = [
  // 账号管理
  {
    path: '/storeroom',
    component: Layout,
    name: 'storeroom',
    meta: { title: i18n.t('sys_m017'), icon: 'el-icon-user' },
    children: [
      {
        path: '/warehouse',
        component: () => import('@/views/storeroom/warehouse'),
        name: 'warehouse',
        meta: {
          title: '账号入库',
        }
      },
      {
        path: '/whats-app-list',
        component: () => import('@/views/storeroom/whats-app-list'),
        name: 'whats-app-list',
        meta: {
          title: '账号列表',
        }
      },
    ]
  },
   // IP管理
  {
    path: '/ipList',
    component: Layout,
    redirect: '/ipManage/ipList',
    name: 'ipList',
    meta: { title: i18n.t('sys_m043'), icon: 'el-icon-cpu' },
    children: [
      {
        path: '/ipList',
        component: () => import('@/views/ipManage/ipList'),
        name: 'ipManage',
        meta: {
          title: i18n.t('sys_m044'),
        }
      }
    ]
  },
  // 权限配置
  {
    path: '/permission',
    component: Layout,
    name: 'permission',
    meta: {
      title: i18n.t('sys_m049'),
      icon: 'lock',
    },
    children: [
      {
        path: '/userManage',
        component: () => import('@/views/permission/userManage'),
        name: 'userManage',
        meta: {
          title: '用户管理',
        }
      },
      {
        path: '/roleManage',
        component: () => import('@/views/permission/roleManage'),
        name: 'roleManage',
        meta: {
          title: '角色管理',
        }
      },
      {
        path: '/menuManage',
        component: () => import('@/views/permission/menuManage'),
        name: 'menuManage',
        meta: {
          title: '菜单管理'
        }
      },
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
