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
      <div >
        <router-link to="Search" class="inline-flex items-center  text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-xs px-3 py-1.5 focus:outline-none">
<svg class="w-3.5 h-3.5 me-1.5 -ms-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"/>
</svg>
البحث </router-link>
      </div>
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