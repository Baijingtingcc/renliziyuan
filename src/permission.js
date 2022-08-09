import store from '@/store'
import router from '@/router'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css'
// const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  NProgress.start()
  const token = store.getters.token
  if (token) {
    // 如果userid不存在 就发送请求
    if (!store.getters.userId) {
      const res = await store.dispatch('user/getUserInfo')
      const data = await store.dispatch(
        'permission/filterRoutes',
        res.roles.menus
      )
      console.log(data)
      router.addRoutes([
        ...data,
        // 404 page must be placed at the end !!!
        {
          path: '*',
          redirect: '/404',
          hidden: true
        }
      ])
      next(to.path)
    }
    // token存在 还要去login页面 则让它跳转到首页
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    // 判断要跳转的页面 是否在白名单
    if (to.path === '/login' || to.path === '/404') {
      next()
    } else {
      next('/login')
    }
  }
})
router.afterEach(() => {
  // 跳转页面成功
  NProgress.done() // 关闭进度条
})
