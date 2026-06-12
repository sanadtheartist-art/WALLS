import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useSiteConfigStore } from '../stores/siteConfig'
import { supabase } from '../config/supabase'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('../pages/LandingPage.vue')
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import('../pages/MaintenancePage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/LoginPage.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../pages/SignupPage.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/dashboard',
    component: () => import('../pages/dashboard/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'DashboardBlocks', component: () => import('../pages/dashboard/DashboardBlocks.vue') },
      { path: 'design', name: 'DashboardDesign', component: () => import('../pages/dashboard/DashboardDesign.vue') },
      { path: 'profile', name: 'DashboardProfile', component: () => import('../pages/dashboard/DashboardProfile.vue') },
      { path: 'analytics', name: 'DashboardAnalytics', component: () => import('../pages/dashboard/DashboardAnalytics.vue') },
      { path: 'settings', name: 'DashboardSettings', component: () => import('../pages/dashboard/DashboardSettings.vue') }
    ]
  },
  {
    path: '/admin',
    component: () => import('../pages/admin/AdminLayout.vue'),
    meta: { requiresAdmin: true },
    children: [
      { path: '', name: 'AdminOverview', component: () => import('../pages/admin/AdminOverview.vue') },
      { path: 'users', name: 'AdminUsers', component: () => import('../pages/admin/AdminUsers.vue') },
      { path: 'reserved', name: 'AdminReserved', component: () => import('../pages/admin/AdminReserved.vue') },
      { path: 'config', name: 'AdminSiteConfig', component: () => import('../pages/admin/AdminSiteConfig.vue') },
      { path: 'analytics', name: 'AdminAnalytics', component: () => import('../pages/admin/AdminAnalytics.vue') },
      { path: 'reports', name: 'AdminReports', component: () => import('../pages/admin/AdminReports.vue') }
    ]
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../pages/admin/AdminLoginPage.vue')
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('../pages/NotFoundPage.vue')
  },
  {
    path: '/:username',
    name: 'PublicProfile',
    component: () => import('../pages/PublicProfile.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const siteConfig = useSiteConfigStore()

  // Wait for auth to initialize
  while (authStore.loading) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Check Supabase admin auth
  const { data } = await supabase.auth.getSession()
  authStore.adminUser = data.session?.user || null
  authStore.adminLoading = false

  if (!siteConfig.loaded) {
    await siteConfig.fetchConfig()
  }

  const isAdminRoute = to.path.startsWith('/admin')

  if (siteConfig.maintenanceActive && !isAdminRoute && to.name !== 'Maintenance') {
    next({ name: 'Maintenance' })
    return
  }

  if (!siteConfig.maintenanceActive && to.name === 'Maintenance') {
    next('/')
    return
  }

  if (to.meta.requiresAuth && !authStore.user) {
    next('/login')
  } else if (to.meta.guestOnly && authStore.user) {
    next('/dashboard')
  } else if (to.meta.requiresAdmin && !authStore.adminUser) {
    next('/admin/login')
  } else {
    next()
  }
})

export default router
