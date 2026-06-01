// Stores/Auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { myInfo, Logout } from '../api/UserService.js'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const checkAuth = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      // ✅ Use /myinfo as single source of truth (requires cookie)
      const profile = await myInfo();
      
      if (profile) {
        isAuthenticated.value = true;
        user.value = {
          id: profile.id,
          email: profile.email,
          name: profile.userName,
          imageUrl: profile.imageUrl,
          roles: Array.isArray(profile.roles) ? profile.roles : [],
          isSusbended: profile.isSusbended,
          cellId: profile.cellId
        };
        
        localStorage.setItem('authUser', JSON.stringify(user.value));
        console.log("✅ Auth verified, user loaded:", user.value);
      }
    } catch (err) {
      console.error('❌ Auth check failed:', err);
      
      // 401/403 means not authenticated
      if (err.response?.status === 401 || err.response?.status === 403) {
        isAuthenticated.value = false;
        user.value = null;
        localStorage.removeItem('authUser');
      } else {
        // Other errors (network, server) - keep trying
        error.value = err.message;
      }
    } finally {
      loading.value = false;
    }
  }

  const setUserFromLogin = (userData) => {
    isAuthenticated.value = true;
    user.value = userData;
    localStorage.setItem('authUser', JSON.stringify(userData));
    console.log("User logged in:", user.value);
    loading.value = false;
  }

  const logout = async () => {
    try {
      await Logout();
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      isAuthenticated.value = false;
      user.value = null;
      localStorage.removeItem('authUser');
    }
  }

  const isVendor = computed(() => {
    const u = user.value;
    if (!u) return false;

    const VENDOR_ROLE_ID = "33333333-3333-3333-3333-333333333333";
    
    // Check roles array
    const rolesArray = u.roles || [];
    if (Array.isArray(rolesArray)) {
      return rolesArray.some(r => 
        r === 'Vendor' || 
        r === 'VENDOR' || 
        r === VENDOR_ROLE_ID
      );
    }
    
    return false;
  });

  // Run checkAuth on store initialization
  checkAuth();

  return {
    isAuthenticated,
    user,
    loading,
    error,
    checkAuth,
    setUserFromLogin,
    logout,
    isVendor
  }
})