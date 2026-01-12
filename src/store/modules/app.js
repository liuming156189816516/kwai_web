import Cookies from 'js-cookie'
import i18n from "@/locale";

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  updateEvent:false,
  device: 'desktop',
  locaLang: Cookies.get('lang')||'zh',
  size: Cookies.get('size') || 'medium'
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_LANGUAGE: (state, lang) => {
    i18n.locale = lang;
    state.locaLang = lang;
    Cookies.set('lang', lang)
  },
  SET_UPDATE_NOTICE: (state, tips) => {
    state.updateEvent = tips;
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  switchLang({ commit }, lang) {
    commit('SET_LANGUAGE', lang=='zh'?'en':'zh')
  },
  showNotice({ commit }, state) {
    commit('SET_UPDATE_NOTICE', state)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
