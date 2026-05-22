<template>
  <div class="min-h-screen flex items-center justify-center bg-brand-bg p-4" dir="rtl">
    
    <!-- Login Card -->
    <div class="bg-white p-8 border border-gray-300 w-full max-w-md">
      
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-brand-text mb-2">تسجيل الدخول</h2>
        <p class="text-gray-500 text-sm">مرحباً بك في اقرأني</p>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="mb-6 p-4 border-l-4 border-red-500 bg-red-50 text-red-700 text-sm flex items-start gap-2">
        <span class="text-lg">⚠️</span>
        <span>{{ error }}</span>
      </div>

      <!-- Suspension Notice -->
      <div v-if="isSuspended" class="mb-6 p-4 border-l-4 border-yellow-500 bg-yellow-50 text-yellow-800 text-sm">
        <div class="flex items-start gap-2">
          <span class="text-lg">🔒</span>
          <div>
            <p class="font-bold mb-1">حسابك معلق مؤقتاً</p>
            <p class="text-xs">{{ suspensionDetails }}</p>
            <button @click="contactSupport" class="mt-2 text-yellow-600 font-bold underline text-xs">
              تواصل مع الدعم الفني
            </button>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-brand-text text-sm font-bold mb-2">البريد الإلكتروني</label>
          <input 
            id="email"
            type="email" 
            v-model="email" 
            required 
            :disabled="isLoading"
            placeholder="example@email.com"
            class="w-full px-4 py-3 bg-transparent border border-gray-300 rounded-none text-brand-text placeholder-gray-400 
                   focus:outline-none focus:border-brand-text focus:ring-1 focus:ring-brand-text transition-colors"
            @input="error = null"
          >
        </div>

        <div>
          <label for="password" class="block text-brand-text text-sm font-bold mb-2">كلمة المرور</label>
          <div class="relative">
            <input 
              id="password"
              :type="showPassword ? 'text' : 'password'" 
              v-model="password" 
              required 
              :disabled="isLoading"
              placeholder="••••••••"
              class="w-full px-4 py-3 bg-transparent border border-gray-300 rounded-none text-brand-text placeholder-gray-400 
                     focus:outline-none focus:border-brand-text focus:ring-1 focus:ring-brand-text transition-colors pr-10"
              @input="error = null"
            >
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-text transition-colors"
              tabindex="-1"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <!-- Remember Me + Forgot Password -->
        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 text-brand-text cursor-pointer">
            <input 
              type="checkbox" 
              v-model="rememberMe"
              :disabled="isLoading"
              class="w-4 h-4 border-gray-300 text-brand-text focus:ring-brand-text"
            >
            <span class="font-medium">تذكرني</span>
          </label>
          <router-link to="/forgot-password" class="font-bold hover:underline transition-colors">
            نسيت كلمة المرور؟
          </router-link>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          :disabled="isLoading || isSuspended"
          class="w-full py-3 px-4 bg-brand-text text-brand-bg rounded-full text-sm font-bold hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="isLoading" class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span>{{ isLoading ? 'جاري التسجيل...' : 'تسجيل الدخول' }}</span>
        </button>
      </form>

      <!-- Register Link -->
      <div class="mt-8 pt-6 border-t border-gray-200 text-center">
        <p class="text-sm">
          ليس لديك حساب؟ 
          <router-link to="/register" class="font-bold underline hover:opacity-70 transition-opacity">
            أنشئ حساباً جديداً
          </router-link>
        </p>
      </div>
      
    </div>
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
    
    // Set user directly from login response
    authStore.setUserFromLogin(response);
    
    const userRole = authStore.user?.roles?.[0] || 'USER';
    
    if (userRole === 'ADMINISTRATOR') {
      router.replace('/AdminPage'); // FIXED REDIRECT
    } else if (userRole === 'VENDOR') {
      router.replace('/UserPage');
    } else {
      router.replace('/'); 
    }
    
  } catch (err) {
    console.error('Login failed:', err);
    
    const errorMsg = err.response?.data?.error || err.message || 'فشل تسجيل الدخول';
    
    if (errorMsg.includes('suspended') || errorMsg.includes('معلق')) {
      isSuspended.value = true;
      
      const match = errorMsg.match(/until\s+([^.]+)\.?\s*Reason:\s*(.+)$/i);
      if (match) {
        const [, until, reason] = match;
        suspensionDetails.value = `حتى ${until.trim()}\nالسبب: ${reason.trim()}`;
      } else {
        suspensionDetails.value = errorMsg;
      }
      
      error.value = 'تم تعليق حسابك مؤقتاً';
    } else {
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