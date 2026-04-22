<template>
  <nav class="stars-container relative w-full border-b border-gray-700 bg-gray-900 p-4">
  <div class="mx-auto flex max-w-screen-xl items-center justify-between">
    <a href="/" class="flex items-center gap-2">
      <img class="h-8 w-8 object-cover rounded" alt="logo" src="https://www.svgrepo.com/show/492788/book-and-person-winter.svg">
      <span class="font-bold text-white">{{ title }}</span>
    </a>

    <ul class="flex flex-row gap-6">
      <li>  <router-link to="/" class="text-xs text-gray-300 hover:text-white">
الصفحة الرئيسية  </router-link></li>

      <li>
  <router-link to="/userpage" class="text-xs text-gray-300 hover:text-white">
    عن المصمم
  </router-link>
</li>
      <li><a href="#" class="text-xs text-gray-300 hover:text-white">الخدمات</a></li>

      <li v-if="isAuthenticated">
         <router-link to="/Login" class="text-xs text-gray-300 hover:text-white">
    
           <img src="https://www.svgrepo.com/show/301085/desk-classroom.svg" alt="img" class="h-4 w-4 inline-block mr-1 ">
           المستخدم   

         </router-link>

         <span class="text-xs text-gray-300 hover:text-white" @click="handleLogout" style="cursor: pointer;">
           <img src="https://www.svgrepo.com/show/281468/open-door-doorway.svg" alt="img" class="h-4 w-4 inline-block mr-1 ">
           تسجيل الخروج   
         </span>
      </li>

      <li v-else>
         <router-link to="/Login" class="text-xs text-gray-300 hover:text-white">
    
           <img src="https://www.svgrepo.com/show/281468/open-door-doorway.svg" alt="img" class="h-4 w-4 inline-block mr-1 ">
           تسجيل الدخول   

         </router-link>
      </li>

    </ul>
      

    <div class="hidden md:block">
      <input 
        type="text" 
        placeholder="Search..." 
        class="rounded-md border border-gray-600 bg-gray-800 px-3 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
    </div>
  </div>
</nav>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IsAuthenticated, Logout } from '../api/UserService'; 

const router = useRouter();
const route = useRoute(); 
const title = ref('Book Store');
const isAuthenticated = ref(false);
const authLoading = ref(true);


const user = ref(null); 

const checkAuth = async () => {
  authLoading.value = true;
  try {
    // If you prefer not making an API call on every single route change, 
    // you can also just check localStorage here: 
    // const hasToken = !!localStorage.getItem('authToken');
    
    const result = await IsAuthenticated();
    isAuthenticated.value = result.authenticated;
    user.value = result.user;
  } catch {
    isAuthenticated.value = false;
    user.value = null;
  } finally {
    authLoading.value = false;
  }
};

onMounted(checkAuth);
watch(() => route.fullPath, checkAuth);

const handleLogout = async () => {
  try {
    await Logout();
    isAuthenticated.value = false;
    user.value = null;
    router.push('/login');
  } catch (error) {
    console.error("Logout error", error);
  }
};
</script>