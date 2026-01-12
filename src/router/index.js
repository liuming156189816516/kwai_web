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
      {
        path: '/accountTest',
        component: () => import('@/views/marketingManage/accountTest'),
        name: 'accountTest',
        meta: {
          title: '账号检测',
        }
      },
      {
        path: '/accountMaintenance',
        component: () => import('@/views/marketingManage/accountMaintenance'),
        name: 'accountMaintenance',
        meta: {
          title: '账号养号',
        }
      },
      /*
      {
        hidden: true,
        path: '/shunt-link-list',
        component: () => import('@/views/storeroom/shunt-link-list'),
        name: 'shunt-link-list',
        meta: {
          title: '分流链接列表',
        }
      },
      {
        hidden: true,
        path: '/share-link-manage',
        component: () => import('@/views/storeroom/link_manage'),
        name: 'share-link-manage',
        meta: {
          title: '分享链接管理',
        }
      },
      {
        hidden: true,
        path: '/shunt-link-detail',
        component: () => import('@/views/storeroom/shunt-link-detail'),
        name: 'shunt-link-detail',
        meta: {
          title: '分流链接详情',
        }
      },
      {
        hidden: true,
        path: '/shunt-allocation-details',
        component: () => import('@/views/storeroom/shunt-allocation-details'),
        name: 'shunt-allocation-details',
        meta: {
          title: '分配详情',
        }
      },
      {
        hidden: true,
        path: '/shunt-link-fans-detail',
        component: () => import('@/views/storeroom/shunt-link-fans-detail'),
        name: 'shunt-link-fans-detail',
        meta: {
          title: '进粉详情',
        }
      },
      {
        hidden: true,
        path: '/modify-wa-profile',
        component: () => import('@/views/storeroom/modify-wa-profile'),
        name: 'modify-wa-profile',
        meta: {
          title: '修改WS资料',
        }
      },
      {
        hidden: true,
        path: '/modify-wa-logs',
        component: () => import('@/views/storeroom/modify-wa-logs'),
        name: 'modify-wa-logs',
        meta: {
          title: '修改WS资料日志',
        }
      }
      */
    ]
  },
  // 营销管理
  {
    path: '/marketingManage',
    component: Layout,
    name: 'marketingManage',
    meta: { title: '营销管理', icon: 'el-icon-monitor' },
    children: [
      {
        path: '/launchTask',
        component: () => import('@/views/marketingManage/launchTask'),
        name: 'launchTask',
        meta: {
          title: '投放任务',
        }
      },
      {
        path: '/launchOrder',
        component: () => import('@/views/marketingManage/launchOrder'),
        name: 'launchOrder',
        meta: {
          title: '投放订单',
        }
      },
      {
        path: '/natureLaunch',
        component: () => import('@/views/marketingManage/natureLaunch'),
        name: 'natureLaunch',
        meta: {
          title: '自然投放',
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
     // 素材管理
  {
    path: '/content',
    component: Layout,
    name: 'content',
    meta: { title: i18n.t('sys_m045'), icon: 'el-icon-folder-opened' },
    children: [
      {
        path: '/material',
        component: () => import('@/views/content/material'),
        name: 'material',
        meta: {
          title: '素材管理',
        }
      },
      {
        path: '/collect',
        component: () => import('@/views/content/collect'),
        name: 'collect',
        meta: {
          title: '素材采集',
        }
      },
      /*
      {
        hidden: true,
        path: '/add',
        component: () => import('@/views/content/add'),
        name: 'add',
        meta: {
          title: i18n.t('sys_m048')
        }
      }
      */
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
      {
        path: '/taskConfig',
        component: () => import('@/views/permission/taskConfig'),
        name: 'taskConfig',
        meta: {
          title: '任务配置'
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
