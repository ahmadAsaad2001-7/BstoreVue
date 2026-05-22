<script setup>
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue'
import BookList from '../components/BookList.vue'
import { GENRES } from '../constants/genres.js'

const selectedCategory = ref(null)

const selectCategory = (index) => {
  if (selectedCategory.value === index) {
    selectedCategory.value = null
  } else {
    selectedCategory.value = index
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <NavBar />

    <div class="max-w-screen-xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">

      <!-- Sidebar Categories -->
      <aside class="w-full md:w-56 lg:w-52 flex-shrink-0">
        <p class="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4 px-1">التصنيفات</p>

        <ul class="flex flex-col gap-1">
          <li>
            <button
              @click="selectedCategory = null"
              class="w-full text-right px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              :class="selectedCategory === null
                ? 'bg-emerald-500/15 text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'"
            >
              عرض الكل
            </button>
          </li>

          <li v-for="(genre, index) in GENRES.slice(0, 15)" :key="genre">
            <button
              @click="selectCategory(index)"
              class="w-full text-right px-3 py-2 rounded-lg text-sm transition-all duration-150"
              :class="selectedCategory === index
                ? 'bg-emerald-500/15 text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'"
            >
              {{ genre }}
            </button>
          </li>
        </ul>

        <!-- Decorative divider -->
        <div class="mt-6 pt-4 border-t border-white/5">
          <p class="text-slate-600 text-xs text-center">♫</p>
        </div>
      </aside>

      <!-- Main Book Grid -->
      <main class="flex-1 min-w-0">
        <!-- Section heading -->
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-xl font-bold text-white">
            {{ selectedCategory !== null ? GENRES[selectedCategory] : 'جميع الكتب' }}
          </h2>
          <div v-if="selectedCategory !== null">
            <button
              @click="selectedCategory = null"
              class="text-xs text-slate-500 hover:text-white transition-colors duration-150 flex items-center gap-1.5"
            >
              <span>✕</span> إلغاء التصفية
            </button>
          </div>
        </div>

        <BookList :selectedCategory="selectedCategory" />
      </main>

    </div>
  </div>
</template>
