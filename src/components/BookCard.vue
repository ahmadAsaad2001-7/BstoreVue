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
  
  // Option B: If you want a cart later:
  // addToCart(bookId)
  // router.push('/cart')
}
</script>

<template>
  <div class="bg-white rounded-lg overflow-hidden shadow-lg max-w-sm cursor-pointer hover:shadow-xl transition-shadow">
    <!-- ... image, title, description ... -->
    
    <div class="p-4">
      <h3 class="text-lg font-medium mb-2 truncate">{{ book.name }}</h3>
     <img :src="book.imageUrl" :alt="book.name" class="w-full h-48 object-cover mb-4 rounded">

      <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ book.description }}</p>
      
      <div class="flex items-center justify-between">
        <span class="font-bold text-lg">${{ Number(book.price).toFixed(2) }}</span>
        
        <!-- ✅ Updated button -->
        <button 
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
          @click.stop="handleBuyNow(book.id)"
        >
          Buy Now
        </button>
        <button 
      @click.stop="viewBook"
      class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
    >
      التفاصيل
    </button>
      </div>
    </div>
  </div>
</template>