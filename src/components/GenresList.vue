<!-- 📁 components/GenresList.vue -->
<script setup>
import { ref } from 'vue'
import { GENRES } from '../constants/genres.js'

const selectedGenres = ref([]) // Stores indices: [0, 1, 5]

const toggleGenre = (genreName, index) => {
  const idx = selectedGenres.value.indexOf(index)
  if (idx === -1) {
    selectedGenres.value.push(index)
  } else {
    selectedGenres.value.splice(idx, 1)
  }
}

// ✅ Expose the integer array to parent
defineExpose({ selectedGenres })
</script>


<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="(genre, index) in GENRES"
      :key="genre"
      type="button"
      @click="toggleGenre(genre, index)"
      :class="[
        'text-sm px-4 py-2 rounded-full border transition-colors focus:outline-none',
        selectedGenres.includes(index)
          ? 'bg-blue-500 text-white border-blue-500'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
      ]"
    >
      {{ genre }}
    </button>
  </div>
</template>