<!-- 📁 components/BookCard.vue -->
<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/CartStore'
import { useAuthStore } from '../stores/Auth'
import { ref, computed } from 'vue'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const isAddingToCart = ref(false)
const feedbackMessage = ref(null)

const props = defineProps({
  book: {
    type: Object,
    required: true,
    validator: (value) => value && (value.id || value.bookId)
  }
})

// ✅ Normalize book ID (handle both 'id' and 'bookId' from different API responses)
const bookId = computed(() => props.book.id || props.book.bookId)
const bookName = computed(() => props.book.name || props.book.title || props.book.bookName)
const bookPrice = computed(() => props.book.price || props.book.unitPrice)
const bookCover = computed(() => 
  props.book.coverUrl || props.book.imageUrl || props.book.bookCoverUrl || '/fallback-book.png'
)

// ✅ Check if book is already in cart (for UI feedback)
const isInCart = computed(() => {
  if (!bookId.value) return false
  return cartStore.cartItems.some(item => item.bookId === bookId.value)
})

const viewBook = () => {
  router.push(`/books/${bookId.value}`)
}

const handleBuyNow = () => {
  router.push({
    path: '/checkout',
    query: { bookId: bookId.value }
  })
}

const handleAddToCart = async (e) => {
  e?.stopPropagation?.()

  // 🔐 Check authentication
  if (!authStore.isAuthenticated) {
    showFeedback('🔐 Please login to add items to cart', 1500)
    setTimeout(() => router.push('/login'), 1500)
    return
  }

  isAddingToCart.value = true
  feedbackMessage.value = null

  try {
    await cartStore.addToCart(bookId.value, 1)
    showFeedback('✅ Added to cart!', 2000)
    
    // Optional: Auto-refresh cart to ensure sync
    // await cartStore.refreshCart()
    
  } catch (err) {
    // 🎯 Handle specific backend errors
    const errorMsg = cartStore.error || err.message || 'Failed to add to cart'
    
    if (err.status === 401) {
      showFeedback('🔐 Session expired. Please login again.', 2000)
      setTimeout(() => router.push('/login'), 2000)
    } else if (err.status === 404) {
      showFeedback('❌ Book no longer available', 2500)
    } else {
      showFeedback(`❌ ${errorMsg}`, 2500)
    }
    console.error('Add to cart failed:', err)
  } finally {
    isAddingToCart.value = false
  }
}

const showFeedback = (message, duration = 2000) => {
  feedbackMessage.value = message
  setTimeout(() => {
    feedbackMessage.value = null
  }, duration)
}
</script>

<template>
  <div
    @click="viewBook"
    class="group cursor-pointer flex flex-col bg-slate-900 border border-white/8 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 hover:border-emerald-500/30"
  >
    <!-- Image Container -->
    <div class="relative w-full aspect-[3/4] overflow-hidden bg-slate-800 flex items-center justify-center p-4">
      <!-- Sale badge -->
      <div v-if="bookPrice < 20" class="absolute top-3 left-3 z-10 text-[10px] font-extrabold uppercase tracking-widest text-white bg-orange-500 rounded-md px-2 py-1 shadow-md">
        Sale
      </div>

      <!-- ✅ In-cart indicator -->
      <div v-if="isInCart" class="absolute top-3 right-3 z-10 text-[10px] font-bold text-emerald-400 bg-emerald-500/20 rounded-full px-2 py-1 border border-emerald-500/30">
        ✓ In Cart
      </div>

      <img
        :src="bookCover"
        :alt="bookName"
        class="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
        @error="(e) => e.target.src = 'https://via.placeholder.com/300x400?text=No+Cover'"
      />

      <!-- Hover overlay with quick action -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center flex-col gap-3 pb-4">
        <button
          @click="handleAddToCart"
          :disabled="isAddingToCart || isInCart"
          class="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 disabled:cursor-not-allowed px-4 py-2 rounded-full border border-emerald-400/50 transition-all duration-200"
        >
          {{ isAddingToCart ? '⏳ Adding...' : isInCart ? '✓ In Cart' : '🛒 Add to Cart' }}
        </button>
        <span class="text-xs font-semibold text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          عرض الكتاب
        </span>
      </div>
    </div>

    <!-- Book Details -->
    <div class="p-4 flex flex-col gap-1">
      <h3 class="font-bold text-sm text-white leading-snug line-clamp-2">
        {{ bookName }}
      </h3>
      <p class="text-emerald-400 font-semibold text-sm mt-1">
        ${{ Number(bookPrice).toFixed(2) }}
      </p>
      
      <!-- Feedback message with smooth transition -->
      <Transition
        enter-active-class="transition-all duration-300"
        leave-active-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <p v-if="feedbackMessage" class="text-center mt-2 text-xs font-semibold text-emerald-400">
          {{ feedbackMessage }}
        </p>
      </Transition>
    </div>
  </div>
</template>