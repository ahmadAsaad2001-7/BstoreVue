<script setup>
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue'
import BookList from '../components/BookList.vue'
import { GENRES } from '../constants/genres.js'

const selectedCategory = ref(null)

const selectCategory = (index) => {
  if (selectedCategory.value === index) {
    selectedCategory.value = null // Deselect
  } else {
    selectedCategory.value = index
  }
}
</script>

<template>
  <div class="min-h-screen bg-brand-bg text-brand-text">
    <NavBar />
    
    <div class="max-w-screen-xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
      
      <!-- Sidebar Categories -->
      <aside class="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
        <ul class="flex flex-col gap-3 font-semibold text-sm">
          <li>
            <button 
              @click="selectedCategory = null" 
              class="hover:opacity-70 transition-opacity text-left w-full"
              :class="{ 'underline decoration-2 underline-offset-4': selectedCategory === null }"
            >
              View All
            </button>
          </li>
          
          <!-- Sample a few top genres for the sidebar to not overwhelm -->
          <li v-for="(genre, index) in GENRES.slice(0, 15)" :key="genre">
            <button 
              @click="selectCategory(index)" 
              class="hover:opacity-70 transition-opacity text-left w-full"
              :class="{ 'underline decoration-2 underline-offset-4': selectedCategory === index }"
            >
              {{ genre }}
            </button>
          </li>

          <li class="pt-4 text-xl">
            <span class="opacity-80">♫</span>
          </li>
        </ul>
      </aside>

      <!-- Main Book Grid -->
      <main class="w-full md:w-3/4 lg:w-4/5">
        <BookList :selectedCategory="selectedCategory" />
      </main>

    </div>
  </div>
</template>