import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginForm,
    meta: { requiresGuest: true },
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user')

  if (to.meta.requiresAuth && !user) {
    // Si la route nécessite une authentification et qu'il n'y a pas d'utilisateur
    next('/')
  } else if (to.meta.requiresGuest && user) {
    // Si on essaie d'accéder au login alors qu'on est déjà connecté
    next('/home')
  } else {
    next()
  }
})

export default router
