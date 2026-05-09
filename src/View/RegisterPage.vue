<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-gray-800 p-4" dir="rtl">
    <div class="bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/50">
      
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-white mb-2">إنشاء حساب جديد</h2>
        <p class="text-gray-400 text-sm">انضم إلى مجتمع اقرأني</p>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
        ⚠️ {{ error }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-5">
        
        <!-- Email Field -->
        <div>
          <label for="email" class="block text-gray-300 text-sm font-medium mb-2">البريد الإلكتروني</label>
          <input 
            id="email"
            type="email" 
            v-model="form.email" 
            required
            class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            placeholder="example@email.com"
          >
        
        </div>

        <!-- TODO: Add Username, Password, Confirm Password, ImageUrl fields -->
        <div>
          <label for="username" class="block text-gray-300 text-sm font-medium mb-2">اسم المستخدم</label>
          <input 
            id="username"
            type="text" 
            v-model="form.userName" 
            required
            class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            placeholder="اسم المستخدم"
          >
        </div>
  <div>
          <label for="name" class="block text-gray-300 text-sm font-medium mb-2">الاسم</label>
          <input 
            id="name"
            type="text" 
            v-model="form.Name" 
            required
            class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            placeholder="الاسم"
          >
        </div>
        <div>
          <label for="password" class="block text-gray-300 text-sm font-medium mb-2">كلمة المرور</label>
          <input 
            id="password"
            type="password" 
            v-model="form.password" 
            required
            class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            placeholder="كلمة المرور"
          >
        </div>

        <div>
          <label for="confirmPassword" class="block text-gray-300 text-sm font-medium mb-2">تأكيد كلمة المرور</label>
          <input 
            id="confirmPassword"
            type="password" 
            v-model="form.confirmPassword" 
            required
            class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            placeholder="تأكيد كلمة المرور"
          >
        </div>

        <div>
          <label for="imageUrl" class="block text-gray-300 text-sm font-medium mb-2">رابط الصورة</label>
          <input 
            id="imageUrl"
            type="text" 
            v-model="form.imageUrl" 
            class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            placeholder="رابط الصورة"
          >
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full py-3 px-4 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ isLoading ? 'جاري الإنشاء...' : 'إنشاء الحساب' }}
        </button>
      </form>

      <!-- Login Link -->
      <p class="mt-6 text-center text-gray-400 text-sm">
        لديك حساب بالفعل؟ 
        <router-link to="/login" class="text-yellow-400 hover:text-yellow-300 font-medium">
          تسجيل الدخول
        </router-link>
      </p>
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
  // TODO: 1. Validate passwords match
  if(form.value.password !== form.value.confirmPassword){
    error.value = 'كلمتا المرور غير متطابقتين';
    return;
  }
  // TODO: 2. Set isLoading = true
  isLoading.value = true;
  error.value = null; 
  // TODO: 3. Call Register(form.value)
  try {
    await Register(form.value);
    
      console.log('تم إنشاء الحساب بنجاح');
    router.push('/login');
  } 
 catch (err) {
  // ✅ Extract validation errors from ASP.NET Core ProblemDetails format
  let backendError = 'حدث خطأ أثناء إنشاء الحساب';
  
  if (err.response?.data?.errors) {
    // ✅ Format field-level errors for display
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
  
  // ✅ Show user-friendly error
  error.value = backendError;
  
  // ✅ Log full error for debugging
  console.error('Registration failed:', {
    status: err.response?.status,
    errors: err.response?.data?.errors,
    fullResponse: err.response?.data
  });
} finally {
      // TODO: 6. Set isLoading = false in finally block
    isLoading.value = false;
  }

 

};
</script>