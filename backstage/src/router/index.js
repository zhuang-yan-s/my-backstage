import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: "/login" },
  { path: '/login', component: () => import('@/views/login/index.vue') },
  {
    path: '/home',
    component: () => import('@/views/home/index.vue'),
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: () => import('@/views/home/welcome/index.vue') },
      { path: '/users', component: () => import('@/views/home/users/index.vue') }
    ]
  }
]


const router = new VueRouter({
  routes
})

// 设置路由守卫 
router.beforeEach((to, from, next) => {
  // 跳转页面时需要登录,并且本地存有登录成功的token
  if (to.path === '/login') return next()
  // 其他页面判断是否存在token, 不存在就强制跳转值登录页
  const token = sessionStorage.getItem('token')
  if (!token) return next('/login')
  // 存在token放行
  next()
})

export default router
