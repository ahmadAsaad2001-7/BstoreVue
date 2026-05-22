<template>
  <nav class="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20">
    <div class="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">

      <!-- Left: Logo -->
      <router-link to="/" class="flex flex-col items-start leading-none group">
        <span class="font-extrabold text-2xl tracking-tighter text-white group-hover:text-emerald-400 transition-colors duration-200">اقرأني®</span>
        <span class="text-[10px] font-medium text-slate-500 mt-0.5 uppercase tracking-widest group-hover:text-emerald-400 transition-colors duration-200">By Iqraani</span>
      </router-link>

      <!-- Center: Links -->
      <ul class="hidden md:flex flex-row gap-1 items-center font-medium text-sm">
        <li>
          <router-link
            to="/"
            class="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
          >المتجر</router-link>
        </li>
        <li>
          <router-link
            to="/Users"
            class="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
          >المستخدمين</router-link>
        </li>
        <li>
          <router-link
            to="/Vendors"
            class="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
          >البائعين</router-link>
        </li>
        <li>
          <router-link
            to="/Search"
            class="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
          >البحث</router-link>
        </li>
      </ul>

      <!-- Right: Auth / Admin -->
      <div class="flex items-center gap-3">
        <router-link
          v-if="authStore.isAuthenticated && authStore.user?.roles?.includes('ADMINISTRATOR')"
          to="/AdminPage"
          class="hidden md:flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors duration-200 border border-amber-400/30 rounded-lg px-3 py-2 hover:bg-amber-400/10"
        >
          <span>⚙</span>
          لوحة التحكم
        </router-link>

        <template v-if="authStore.isAuthenticated">
          <router-link
            to="/UserPage"
            class="hidden md:flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
          >
            <span class="inline-flex w-8 h-8 rounded-full bg-emerald-600 items-center justify-center text-white text-xs font-bold">
              {{ (authStore.user?.name || 'U').charAt(0).toUpperCase() }}
            </span>
            {{ authStore.user?.name || 'حسابي' }}
          </router-link>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold hover:bg-rose-500/20 hover:text-rose-300 transition-all duration-200 cursor-pointer"
          >
            خروج
          </button>
        </template>

        <template v-else>
          <router-link
            to="/login"
            class="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-xs font-bold transition-all duration-200 shadow-md shadow-emerald-900/30"
          >
            تسجيل الدخول
          </router-link>
        </template>
      </div>

    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../Stores/Auth.js';

const authStore = useAuthStore();
const router = useRouter();
const title = ref('اقرأني');

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>
