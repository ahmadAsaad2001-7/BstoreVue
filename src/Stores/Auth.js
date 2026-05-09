import { defineStore } from 'pinia'
import { ref ,computed} from 'vue'

import { IsAuthenticated, Logout, myInfo } from '../api/UserService.js'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

const checkAuth = async () => {
  loading.value = true;
  try {
    // Check if token exists in localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      isAuthenticated.value = false;
      user.value = null;
      loading.value = false;
      return;
    }

    const result = await IsAuthenticated();
    isAuthenticated.value = result.authenticated;
    
    if (result.authenticated) {
      const profile = await myInfo();
 
      user.value = { ...result.user, ...profile }; 
      localStorage.setItem('authUser', JSON.stringify(user.value));
      console.log("Current User Data:", user.value); 
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
  } catch (err) {
      console.error('Auth check failed:', err)
      isAuthenticated.value = false
      user.value = null
      error.value = err.message
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    } finally {
      loading.value = false
    }
  }

 const logout = async () => {
  try {
    await Logout(); 
  } catch (err) {
    console.error('Logout API call failed:', err);
  } finally {
   
    isAuthenticated.value = false;
    user.value = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  
  }
}

const isVendor = computed(() => {
  const u = user.value;
  if (!u) return false;

  const roleValue = u.role || "";
  const rolesArray = u.roles || [];

  return roleValue === 'VENDOR' || rolesArray.includes('VENDOR');
});

  checkAuth()

  return {
    isAuthenticated,
    user,
    loading,
    error,
    checkAuth,
    logout,
    isVendor
  }
})