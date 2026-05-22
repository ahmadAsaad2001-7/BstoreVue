<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
</script>

<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white">
    <!-- Decorative background orb -->
    <div class="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-emerald-700/20 blur-3xl"></div>
    <div class="pointer-events-none absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-2xl"></div>

    <div class="container mx-auto flex flex-col md:flex-row items-center gap-12 px-6 md:px-16 py-20 md:py-28 relative z-10">
      
      <!-- Text content -->
      <div class="flex-1 flex flex-col md:items-start items-center text-center md:text-right order-2 md:order-1">
        <span class="inline-block mb-4 text-xs font-semibold tracking-widest uppercase text-emerald-400 border border-emerald-400/30 rounded-full px-4 py-1.5 bg-emerald-400/10">
          مرحباً بك
        </span>

        <h1 class="text-5xl md:text-6xl font-extrabold leading-tight mb-5 text-white">
          اقرأني
        </h1>

        <p class="mb-10 text-base md:text-lg leading-relaxed text-slate-300 max-w-md">
          هذا الموقع صمم لتجربة بعض الاشياء والتعلم
        </p>

        <div class="flex flex-wrap gap-4 justify-center md:justify-start">
          <router-link
            to="/Vendors"
            class="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 px-7 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-900/40 hover:shadow-emerald-700/40 hover:-translate-y-0.5"
          >
            البحث عن تجار الكتب
            <span class="text-lg leading-none">←</span>
          </router-link>

          <router-link
            to="/Users"
            class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-7 rounded-xl border border-white/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            المستخدمين القريبين
          </router-link>
        </div>
      </div>

      <!-- Hero image -->
      <div class="flex-1 flex justify-center order-1 md:order-2">
        <div class="relative w-full max-w-sm md:max-w-md">
          <div class="absolute inset-0 rounded-2xl bg-emerald-400/10 blur-xl scale-95 translate-y-4"></div>
          <img
            class="relative w-full rounded-2xl object-cover shadow-2xl shadow-black/40 border border-white/10"
            alt="hero"
            src="https://cdn.pixabay.com/photo/2025/07/17/10/16/firefly-9719231_1280.png"
          />
        </div>
      </div>

    </div>
  </section>
</template>
