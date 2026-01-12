import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UserInfo = 'Admin'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getUserInfo() {
  return Cookies.get(UserInfo)?JSON.parse(Cookies.get(UserInfo)):"";
}

export function setUserInfo(info) {
  return Cookies.set(UserInfo, info)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
