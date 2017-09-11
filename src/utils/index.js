export function saveUserItem (user) {
  let userStr = ''
  userStr = JSON.stringify(user)
  window.localStorage.setItem('user', userStr)
}
export function getUserItem (key) {
  let userStr = window.localStorage.getItem(key)
  let userObj = JSON.parse(userStr)
  if (window.localStorage[key]) {
    return userObj
  }
  return false
}
export function removeUser () {
  if (window.localStorage.user) {
    window.localStorage.removeItem('user')
  }
  return
}

