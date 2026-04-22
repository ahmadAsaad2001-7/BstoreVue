<template>

<div class="min-h-screen flex items-center justify-center bg-gray-100">
  <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
    <h2 class="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label for="email" class="block text-gray-700 mb-2">Email Address</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          required 
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        >
      </div>
      <div class="mb-6">
        <label for="password" class="block text-gray-700 mb-2">Password</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          required 
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        >
      </div>
      <button 
        type="submit" 
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Login
      </button>
    </form>
  </div>
</div>
</template>
<script>
import { Login } from '../api/UserService';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const router = useRouter();
    const IsLoading = ref(false);
    const error = ref(null);


    const handleLogin = async () => {
      try {
        error.value=null;
        IsLoading.value=true;

       const response = await Login(email.value, password.value);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('authToken',response.token);
        router.push('/');
      } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials and try again.');
      }
    };

    return {
      email,
      password,
      handleLogin
    };
  }
};
  

</script>