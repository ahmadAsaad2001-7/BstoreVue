<template>
  <nav class="stars-container relative w-full border-b border-gray-700 bg-gray-900 p-4">
  <div class="mx-auto flex max-w-screen-xl items-center justify-between">
  

     
              <router-link to="/" class="flex items-center gap-2">
                <img class="h-8 w-8 object-cover rounded" alt="logo" src="https://www.svgrepo.com/show/492788/book-and-person-winter.svg">
                <span class="font-bold text-white">{{ title }}</span>
              </router-link>
       
          
           <router-link 
          v-if="authStore.isAuthenticated && authStore.user?.roles?.includes('ADMINISTRATOR')"
          to="/AdminPage" >
         
        >
          <span class=" text-white">
            <img src="https://www.svgrepo.com/show/492788/book-and-person-winter.svg" alt="img" class="h-4 w-4 inline-block mr-1 "> 
            لوحة التحكم
          </span>
        </router-link>
      
    <ul class="flex flex-row gap-6">
    

      <li>  <router-link to="/" class="text-xs text-gray-300 hover:text-white">
الصفحة الرئيسية  </router-link></li>

      <li>
  <router-link to="/userpage" class="text-xs text-gray-300 hover:text-white">
    عن المصمم
  </router-link>
</li>

      <li v-if="authStore.isAuthenticated">
         <router-link to="/UserPage" class="text-xs text-gray-300 hover:text-white">
    
           <img src="https://www.svgrepo.com/show/301085/desk-classroom.svg" alt="img" class="h-4 w-4 inline-block mr-1 ">
          {{ authStore.user?.name || 'حسابي' }}

         </router-link>
         <span>---</span>
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

         <router-link to="/register" class="text-xs text-gray-300 hover:text-white ml-4">
    
           <img src="https://www.svgrepo.com/show/281468/open-door-doorway.svg" alt="img" class="h-4 w-4 inline-block mr-1 ">
           إنشاء حساب
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
import { useAuthStore } from '../Stores/Auth';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute(); 
const title = ref('Book Store');

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

</script>