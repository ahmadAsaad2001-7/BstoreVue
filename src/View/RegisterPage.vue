<template>
  <div class="min-h-screen flex items-center justify-center bg-brand-bg p-4" dir="rtl">
    <div class="bg-white p-8 border border-gray-300 w-full max-w-md">
      
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-brand-text mb-2">إنشاء حساب جديد</h2>
        <p class="text-gray-500 text-sm">انضم إلى مجتمع اقرأني</p>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="mb-6 p-4 border-l-4 border-red-500 bg-red-50 text-red-700 text-sm font-medium">
        ⚠️ {{ error }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-6">
        
        <!-- Email Field -->
        <div>
          <label for="email" class="block text-brand-text text-sm font-bold mb-2">البريد الإلكتروني</label>
          <input 
            id="email"
            type="email" 
            v-model="form.email" 
            required
            class="w-full px-4 py-3 bg-transparent border border-gray-300 rounded-none text-brand-text placeholder-gray-400 focus:outline-none focus:border-brand-text focus:ring-1 focus:ring-brand-text transition-colors"
            placeholder="example@email.com"
          >
        </div>

        <div>
          <label for="username" class="block text-brand-text text-sm font-bold mb-2">اسم المستخدم</label>
          <input 
            id="username"
            type="text" 
            v-model="form.userName" 
            required
            class="w-full px-4 py-3 bg-transparent border border-gray-300 rounded-none text-brand-text placeholder-gray-400 focus:outline-none focus:border-brand-text focus:ring-1 focus:ring-brand-text transition-colors"
            placeholder="اسم المستخدم"
          >
        </div>

        <div>
          <label for="name" class="block text-brand-text text-sm font-bold mb-2">الاسم</label>
          <input 
            id="name"
            type="text" 
            v-model="form.Name" 
            required
            class="w-full px-4 py-3 bg-transparent border border-gray-300 rounded-none text-brand-text placeholder-gray-400 focus:outline-none focus:border-brand-text focus:ring-1 focus:ring-brand-text transition-colors"
            placeholder="الاسم"
          >
        </div>

        <div>
          <label for="password" class="block text-brand-text text-sm font-bold mb-2">كلمة المرور</label>
          <input 
            id="password"
            type="password" 
            v-model="form.password" 
            required
            class="w-full px-4 py-3 bg-transparent border border-gray-300 rounded-none text-brand-text placeholder-gray-400 focus:outline-none focus:border-brand-text focus:ring-1 focus:ring-brand-text transition-colors"
            placeholder="كلمة المرور"
          >
        </div>

        <div>
          <label for="confirmPassword" class="block text-brand-text text-sm font-bold mb-2">تأكيد كلمة المرور</label>
          <input 
            id="confirmPassword"
            type="password" 
            v-model="form.confirmPassword" 
            required
            class="w-full px-4 py-3 bg-transparent border border-gray-300 rounded-none text-brand-text placeholder-gray-400 focus:outline-none focus:border-brand-text focus:ring-1 focus:ring-brand-text transition-colors"
            placeholder="تأكيد كلمة المرور"
          >
        </div>

        <div>
          <label for="imageUrl" class="block text-brand-text text-sm font-bold mb-2">رابط الصورة (اختياري)</label>
          <input 
            id="imageUrl"
            type="text" 
            v-model="form.imageUrl" 
            class="w-full px-4 py-3 bg-transparent border border-gray-300 rounded-none text-brand-text placeholder-gray-400 focus:outline-none focus:border-brand-text focus:ring-1 focus:ring-brand-text transition-colors"
            placeholder="https://..."
          >
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full py-3 px-4 bg-brand-text text-brand-bg rounded-full text-sm font-bold hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ isLoading ? 'جاري الإنشاء...' : 'إنشاء الحساب' }}
        </button>
      </form>

      <!-- Login Link -->
      <div class="mt-8 pt-6 border-t border-gray-200 text-center">
        <p class="text-sm">
          لديك حساب بالفعل؟ 
          <router-link to="/login" class="font-bold underline hover:opacity-70 transition-opacity">
            تسجيل الدخول
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Register } from '../api/UserService.js';

const router = useRouter();
const isLoading = ref(false);
const error = ref(null);

const form = ref({
  email: '',
  userName: '',
  Name: '',
  password: '',
  confirmPassword: '',
  imageUrl: ''
});

const handleRegister = async () => {
  if(form.value.password !== form.value.confirmPassword){
    error.value = 'كلمتا المرور غير متطابقتين';
    return;
  }
  
  isLoading.value = true;
  error.value = null; 
  
  try {
    await Register(form.value);
    console.log('تم إنشاء الحساب بنجاح');
    router.push('/login');
  } catch (err) {
    let backendError = 'حدث خطأ أثناء إنشاء الحساب';
    
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      const errorMessages = Object.entries(errors)
        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
        .join('\n');
      
      backendError = errorMessages;
    } else if (err.response?.data?.error) {
      backendError = err.response.data.error;
    } else if (err.response?.data?.title) {
      backendError = err.response.data.title;
    } else {
      backendError = err.message || backendError;
    }
    
    error.value = backendError;
    console.error('Registration failed:', err);
  } finally {
    isLoading.value = false;
  }
};
</script>