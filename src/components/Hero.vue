<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';


const router = useRouter();
const route = useRoute(); 
</script>
<template>
  <section class="stars-container relative text-gray-600 body-font bg-white dark:bg-slate-900">
    <div class="container mx-auto flex md:px-24 md:py-10 md:flex-row flex-col items-center">
        <div
            class="lg:flex-grow mt-5 md:mt-0   md:w-1.5/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1
                class="text-2xl font-extrabold leading-9 tracking-tight mb-3 text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-normal">
                اقرأني
            </h1>
        
            <p class="mb-8 md:pl-0  pl-2 pr-2 leading-relaxed dark:text-gray-300">
                هذا الموقع صمم لتجربة بعض الاشياء والتعلم
            </p>
            <div class="flex justify-center">
                <router-link to="/Vendors"
                    class="inline-flex text-white bg-emerald-600 border-0 py-2 px-6 focus:outline-none hover:bg-emerald-600 rounded text-lg">فلتبدأ البحث عن تجار الكتب 
                </router-link>
                  <router-link to="/Users"
                    class="inline-flex text-white bg-emerald-600 border-0 py-2 px-6 focus:outline-none hover:bg-emerald-600 rounded text-lg">فلتبدأ البحث عن المستخدمين القريبين  
                </router-link>
              
            </div>

        </div>
        <div class="lg:max-w-lg lg:w-full mb-5 md:mb-0 md:w-1/2 w-3/6">
            <img class="object-cover object-center rounded" alt="hero" src="https://cdn.pixabay.com/photo/2025/07/17/10/16/firefly-9719231_1280.png">
        </div>
    </div>
</section>
</template>