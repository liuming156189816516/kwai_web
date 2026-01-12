import { asyncRoutes, constantRoutes } from '@/router'
import { adminmenu } from '@/api/login'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
// export function filterAsyncRoutes(routes, roles) {
//   const res = []
//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })
//   return res
// }

export function filterAsyncRoutes(asyncRouter,routers){
  return asyncRouter.filter(item =>{
    if (routers.includes(item.path)||item.hidden) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoutes(item.children,routers)
      }
      return true
    }
  })
}

export function filterAllMenu(menuList,router=[]){
  menuList.forEach(item =>{
    router.push(item.path);
    if (item.children && item.children.length > 0) {
      filterAllMenu(item.children,router);
    }
  })
  return router;
}

const state = {
  roles:"",
  userMenu:[],
  routes: [],
  addRoutes: []
}
const mutations = {
  SET_ROUTES: (state, routes) => {
    let rolesRouter = [];
    let userMenu = filterAllMenu(state.userMenu);
    // &&state.roles !== "liuming"
    if (state.roles !== "admin"&&state.roles !== "lucky888") {
      rolesRouter = filterAsyncRoutes(asyncRoutes,userMenu);
    }else{
      rolesRouter = routes;
    }
    state.addRoutes = rolesRouter
    state.routes = [...constantRoutes,...rolesRouter]
  },
  SET_MENU: (state, menu) => {
    state.userMenu = menu
  },
  SET_ROLE: (state, role) => {
    state.roles = role
  }
}

const actions = {
  async generateRoutes({ commit }, roles) {
    let { data } = await adminmenu({});
    let userMenu = data.memu || [];
    return new Promise(resolve => {
      commit('SET_ROLE', roles)
      commit('SET_MENU', userMenu)
      let accessedRoutes = asyncRoutes || []
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
