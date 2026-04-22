<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
    <BookCard 
      v-for="book in books" 
      :key="book.id" 
      :book="book" 
    />
    
    <!-- Loading State -->
    <div v-if="loading" class="col-span-full text-center text-gray-500 py-10">
      Loading books...
    </div>
    
    <!-- Error State -->
    <div v-if="error" class="col-span-full text-center text-red-500 py-10">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBooks } from '../api/BookService'
import BookCard from './BookCard.vue'


const books = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const data = await getBooks()
    books.value = data
  } catch (err) {
    console.error('Failed to fetch books:', err)
    
    error.value = err?.message || 'Failed to load books. Is the API running?'
  } finally {
    loading.value = false
  }
})
</script>