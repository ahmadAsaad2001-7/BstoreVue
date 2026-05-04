<!-- 📁 components/BookCard.vue -->
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  book: {
    type: Object,
    required: true,
    validator: (value) => value && typeof value.id === 'string'
  }
})
const viewBook = () => {
  router.push(`/books/${props.book.id}`);
};
// ✅ Navigate to checkout with book ID
const handleBuyNow = (bookId) => {
  // Option A: Direct checkout (single book)
  router.push({
    path: '/checkout',
    query: { bookId } // ?bookId=xxx
  })
  

}
</script>

<template>
  <div class="group bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg">
    <div class="relative aspect-[3/4] overflow-hidden bg-gray-800">
      <img 
        :src="book.coverUrl || book.imageUrl || '/fallback-book.png'" 
        :alt="book.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        @error="(e) => e.target.src = 'https://via.placeholder.com/300x400?text=No+Cover'"
      />
      <div class="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
        ${{ book.price }}
      </div>
    </div>

    <!-- تفاصيل الكتاب -->
    <div class="p-4">
      <h3 class="text-white font-bold text-lg truncate mb-1">{{ book.title || book.name }}</h3>
      <p class="text-gray-400 text-sm mb-4">{{ book.author }}</p>
      
      <div class="flex gap-2">
        <button class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-bold transition" @click.stop="handleBuyNow(book.id)">
          شراء الآن
        </button>
        <button class="px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-xl text-sm transition" @click.stop="viewBook">
          التفاصيل
        </button>
      </div>
    </div>
  </div>
</template>