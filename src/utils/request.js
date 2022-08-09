import axios from 'axios'
import { getTime } from '@/utils/auth'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
})

// 定义是否过期的时间戳
function timeOutKey() {
  return Date.now() - getTime() < 7000000
}

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = store.getters.token
    if (token) {
      // 主动介入
      // 判断时间戳是否超时
      if (timeOutKey()) {
        config.headers.Authorization = `Bearer ${token}`
      } else {
        store.dispatch('user/loginOut') // 登出操作
        router.push('/')
        Message.error('登录过期，请重新登录')
        return Promise.reject(new Error('token超时了'))
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const {
      data: { data, message, success }
    } = response
    if (success) {
      return data
    }
    Message.error(message || '系统错误')
    return Promise.reject(message || '系统错误')
  },
  (error) => {
    // 被动处理
    console.log(error)
    // 判断状态码是否为401
    if (error.response.status === 401) {
      // 触发actions里的方法
      store.dispatch('user/loginOut')
      // 路由跳转到login页面
      router.push('/login')
    }
    // 错误提示
    Message.error(error.response.data.message || '系统错误')
    // 返回一个reject 阻止往下执行
    return Promise.reject(error)
  }
)

export default request
