<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="n in 6"
        :key="n"
        class="bg-slate-800 border border-white/8 rounded-2xl overflow-hidden animate-pulse"
      >
        <div class="aspect-[3/4] bg-slate-700"></div>
        <div class="p-4 space-y-2">
          <div class="h-3.5 bg-slate-700 rounded w-3/4"></div>
          <div class="h-3 bg-slate-700 rounded w-1/3"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div class="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-3xl">
        ✕
      </div>
      <p class="text-rose-400 font-semibold text-sm max-w-sm">{{ error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredBooks.length === 0" class="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div class="w-16 h-16 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-3xl">
        📚
      </div>
      <p class="text-slate-400 font-medium text-sm">لم يتم العثور على كتب لهذه الفئة</p>
    </div>

    <!-- Book Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      <BookCard
        v-for="book in filteredBooks"
        :key="book.id"
        :book="book"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getBooks } from '../api/BookService.js'
import BookCard from './BookCard.vue'

const props = defineProps({
  selectedCategory: {
    type: Number,
    default: null
  }
})

const books = ref([])
const loading = ref(true)
const error = ref(null)

const filteredBooks = computed(() => {
  if (props.selectedCategory === null) return books.value;
  return books.value.filter(b => b.genres?.includes(props.selectedCategory));
});

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
