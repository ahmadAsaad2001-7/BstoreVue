<!-- views/Login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-gray-800 p-4" dir="rtl">
    
    <!-- Login Card -->
    <div class="bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/50">
      
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/20 mb-4">
          <span class="text-3xl">📚</span>
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">تسجيل الدخول</h2>
        <p class="text-gray-400 text-sm">مرحباً بك في اقرأني</p>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm flex items-start gap-2">
        <span class="text-lg">⚠️</span>
        <span>{{ error }}</span>
      </div>

      <!-- Suspension Notice (Special styling) -->
      <div v-if="isSuspended" class="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-sm">
        <div class="flex items-start gap-2">
          <span class="text-lg">🔒</span>
          <div>
            <p class="font-medium mb-1">حسابك معلق مؤقتاً</p>
            <p class="text-xs opacity-90">{{ suspensionDetails }}</p>
            <button @click="contactSupport" class="mt-2 text-amber-400 hover:text-amber-300 text-xs underline">
              تواصل مع الدعم الفني
            </button>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        
 
        <div>
          <label for="email" class="block text-gray-300 text-sm font-medium mb-2">البريد الإلكتروني</label>
          <input 
            id="email"
            type="email" 
            v-model="email" 
            required 
            :disabled="isLoading"
            placeholder="example@email.com"
            class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 
                   focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            @input="error = null"
          >
        </div>

        <div>
          <label for="password" class="block text-gray-300 text-sm font-medium mb-2">كلمة المرور</label>
          <div class="relative">
            <input 
              id="password"
              :type="showPassword ? 'text' : 'password'" 
              v-model="password" 
              required 
              :disabled="isLoading"
              placeholder="••••••••"
              class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 
                     focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all pr-10"
              @input="error = null"
            >
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              tabindex="-1"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <!-- Remember Me + Forgot Password -->
        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 text-gray-300 cursor-pointer">
            <input 
              type="checkbox" 
              v-model="rememberMe"
              :disabled="isLoading"
              class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-yellow-500 focus:ring-yellow-500/50"
            >
            <span>تذكرني</span>
          </label>
          <router-link to="/forgot-password" class="text-yellow-400 hover:text-yellow-300 transition-colors">
            نسيت كلمة المرور؟
          </router-link>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          :disabled="isLoading || isSuspended"
          class="w-full py-3 px-4 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed 
                 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2
                 shadow-lg shadow-yellow-600/20 hover:shadow-yellow-500/30"
        >
          <!-- Loading Spinner -->
          <span v-if="isLoading" class="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span>{{ isLoading ? 'جاري التسجيل...' : 'تسجيل الدخول' }}</span>
        </button>
      </form>

      <!-- Divider -->
      <div class="my-6 flex items-center gap-3">
        <div class="flex-1 h-px bg-gray-700"></div>
        <span class="text-gray-500 text-xs">أو</span>
        <div class="flex-1 h-px bg-gray-700"></div>
      </div>

      <!-- Register Link -->
      <p class="text-center text-gray-400 text-sm">
        ليس لديك حساب؟ 
        <router-link to="/register" class="text-yellow-400 hover:text-yellow-300 font-medium transition-colors">
          أنشئ حساباً جديداً
        </router-link>
      </p>
    </div>

    <!-- Footer -->
    <p class="mt-8 text-center text-gray-500 text-xs">
      © {{ new Date().getFullYear() }} اقرأني. جميع الحقوق محفوظة.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../Stores/Auth.js';
import { Login } from '../api/UserService.js';


const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);


const isLoading = ref(false);
const error = ref(null);
const isSuspended = ref(false);
const suspensionDetails = ref('');


const router = useRouter();
const authStore = useAuthStore();


const handleLogin = async () => {

  error.value = null;
  isSuspended.value = false;
  suspensionDetails.value = '';
  isLoading.value = true;

  try {

    const response = await Login(email.value, password.value);
    

    await authStore.checkAuth();
    
    const userRole = authStore.user?.roles?.[0] || 'USER';
    
    if (userRole === 'ADMINISTRATOR') {
      router.replace('/userpage');
    } else if (userRole === 'VENDOR') {
      router.replace('/UserPage');
    } else {
      router.replace('/'); // Default home page
    }
    
  } catch (err) {
    console.error('Login failed:', err);
    
    // ✅ Handle suspension error (backend returns specific message)
    const errorMsg = err.response?.data?.error || err.message || 'فشل تسجيل الدخول';
    
    // Check if error contains suspension keywords (backend format)
    if (errorMsg.includes('suspended') || errorMsg.includes('معلق')) {
      isSuspended.value = true;
      
      // Extract suspension details from error message
      // Format: "Your account is suspended until 4/24/2025 2:30 PM. Reason: Violation of guidelines"
      const match = errorMsg.match(/until\s+([^.]+)\.?\s*Reason:\s*(.+)$/i);
      if (match) {
        const [, until, reason] = match;
        suspensionDetails.value = `حتى ${until.trim()}\nالسبب: ${reason.trim()}`;
      } else {
        suspensionDetails.value = errorMsg;
      }
      
      error.value = 'تم تعليق حسابك مؤقتاً';
    } else {
      // Generic auth error
      error.value = errorMsg === 'Invalid email or password.' 
        ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
        : errorMsg;
    }
    
  } finally {
    isLoading.value = false;
  }
};


const contactSupport = () => {

  window.location.href = 'mailto:support@iqraani.com?subject=Account Suspension Appeal';

};
</script>

<style scoped>

input, button, a {
  @apply transition-all duration-200;
}


::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Focus ring animation */
input:focus {
  @apply transform scale-[1.01];
}
</style>