import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { getToken, removeToken, setToken, setTime } from '@/utils/auth'
import { resetRouter } from '@/router'
// 状态
const state = {
  token: getToken(),
  userInfo: {}
}
// 修改状态
const mutations = {
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    const res = await login(data)
    context.commit('setToken', res)
    // 登录成功后获取时间戳
    setTime()
  },
  async getUserInfo(context) {
    const res = await getUserInfo()
    // 调用获取图片的接口
    const info = await getUserDetailById(res.userId)
    // 添加到vuex中
    context.commit('setUserInfo', {
      ...res,
      ...info
    })
    return {
      ...res,
      ...info
    }
  },
  loginOut(context) {
    context.commit('removeUserInfo')
    context.commit('removeToken')
    resetRouter()
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
