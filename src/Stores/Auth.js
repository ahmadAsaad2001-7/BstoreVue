import { defineStore } from 'pinia'
import { ref } from 'vue'
import { IsAuthenticated, Logout, myInfo } from '../api/UserService'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const checkAuth = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await IsAuthenticated()
      isAuthenticated.value = result.authenticated
      user.value = result.authenticated ? result.user : null

      if (result.authenticated) {
        try {
          const profile = await myInfo()
          user.value = { ...user.value, ...profile }
        } catch (e) {
          console.warn('Could not fetch full profile:', e)
        }
      }
    } catch (err) {
      console.error('Auth check failed:', err)
      isAuthenticated.value = false
      user.value = null
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await Logout()
    } catch (err) {
      console.error('Logout API call failed:', err)
    } finally {
      isAuthenticated.value = false
      user.value = null
    }
  }


  checkAuth()

  return {
    isAuthenticated,
    user,
    loading,
    error,
    checkAuth,
    logout
  }
})