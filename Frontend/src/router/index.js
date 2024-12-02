import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import Home from '@/views/Home_admin.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginForm,
    meta: { requiresGuest: true },
  },
  {
    path: '/home_admin',
    name: 'HomeAdmin',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
  {
    path: '/job/:id',
    name: 'JobDetail',
    component: () => import('../views/JobDetail.vue'),
  },
  {
    path: '/home_user',
    name: 'HomeUser',
    component: () => import('../views/Home_user.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user')

  if (to.meta.requiresAuth && !user) {
    next('/')
  } else if (to.meta.requiresGuest && user) {
    next('/home_admin')
  } else {
    next()
  }
})

export default router
