<!-- 📁 views/BookDetail.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-gray-800 p-4 md:p-8" dir="rtl">
    
    <!-- Back Button -->
    <button 
      @click="router.back()" 
      class="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
    >
      <span>←</span>
      <span>العودة</span>
    </button>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-5xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
        <!-- Image Skeleton -->
        <div class="bg-gray-700/50 rounded-2xl h-96"></div>
        <!-- Content Skeleton -->
        <div class="space-y-4">
          <div class="h-8 bg-gray-700/50 rounded w-3/4"></div>
          <div class="h-4 bg-gray-700/50 rounded w-1/2"></div>
          <div class="h-32 bg-gray-700/50 rounded"></div>
          <div class="h-12 bg-gray-700/50 rounded w-48"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-2xl mx-auto text-center py-16">
      <div class="text-6xl mb-4">⚠️</div>
      <h2 class="text-2xl font-bold text-white mb-2">عذرًا، لم نتمكن من تحميل الكتاب</h2>
      <p class="text-gray-400 mb-6">{{ error }}</p>
      <button 
        @click="router.back()" 
        class="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors"
      >
        العودة للصفحة السابقة
      </button>
    </div>

    <!-- Book Details (when loaded) -->
    <div v-else-if="book" class="max-w-5xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        <!-- 🖼️ Book Image -->
        <div class="relative group">
          <div class="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
            <img 
              :src="book.imageUrl || 'https://www.svgrepo.com/show/492785/book-and-person-summer.svg'" 
              :alt="book.name"
              class="w-full h-auto max-h-[500px] object-contain rounded-xl transition-transform group-hover:scale-[1.02]"
            >
            <!-- Sale Badge -->
            <div v-if="book.price < 20" class="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              🔥 عرض خاص
            </div>
          </div>
        </div>

        <!-- 📝 Book Info -->
        <div class="space-y-6">
          
          <!-- Title & Author -->
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-3">{{ book.name }}</h1>
            <p class="text-lg text-gray-400">
              <span class="text-gray-500">المؤلف:</span> 
              <span class="text-white">{{ book.author || 'غير معروف' }}</span>
            </p>
            <!-- Rating (if available) -->
            <div v-if="book.rating" class="flex items-center gap-1 mt-2">
              <span class="text-yellow-400">★</span>
              <span class="text-white font-medium">{{ book.rating }}/5</span>
              <span class="text-gray-500 text-sm">({{ book.reviewCount || 0 }} تقييم)</span>
            </div>
          </div>

          <!-- Price -->
          <div class="flex items-center gap-4">
            <span class="text-4xl font-bold text-yellow-400">${{ Number(book.price).toFixed(2) }}</span>
            <span v-if="book.originalPrice" class="text-xl text-gray-500 line-through">
              ${{ Number(book.originalPrice).toFixed(2) }}
            </span>
          </div>

          <!-- Description -->
          <div>
            <h3 class="text-lg font-semibold text-white mb-3">نبذة عن الكتاب</h3>
            <p class="text-gray-300 leading-relaxed whitespace-pre-line">
              {{ book.description || 'لا توجد نبذة متاحة لهذا الكتاب.' }}
            </p>
          </div>

          <!-- Vendor Info (if available) -->
          <div v-if="book.vendorName" class="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <p class="text-sm text-gray-400">
              <span class="text-gray-500">بائع:</span> 
              <span class="text-white font-medium">{{ book.vendorName }}</span>
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              @click="handleBuyNow"
              class="flex-1 py-4 px-6 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
            >
              <span>🛒</span>
              شراء الآن
            </button>
            
            <button 
              @click="addToWishlist"
              class="flex-1 py-4 px-6 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors border border-gray-600"
            >
              <span>❤️</span>
              إضافة للمفضلة
            </button>
          </div>

          <!-- Security Note -->
          <p class="text-center text-gray-500 text-xs pt-4">
            🔒 دفع آمن عبر Stripe • تسليم فوري بعد الشراء
          </p>

        </div>
      </div>

      <!-- 📚 Optional: Related Books Section -->
      <div v-if="relatedBooks?.length" class="mt-16 pt-8 border-t border-gray-700/50">
        <h2 class="text-2xl font-bold text-white mb-6">قد يعجبك أيضًا</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <BookCard 
            v-for="related in relatedBooks" 
            :key="related.id" 
            :book="related"
            @view-details="viewBook"
          />
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getBookById } from '../api/BookService';
import BookCard from '../components/BookCard.vue'; // Optional: for related books

const route = useRoute();
const router = useRouter();

// State
const book = ref(null);
const relatedBooks = ref([]);
const loading = ref(true);
const error = ref(null);

// Fetch book details on mount
onMounted(async () => {
  const bookId = route.params.id;
  
  if (!bookId) {
    error.value = 'معرف الكتاب غير موجود';
    loading.value = false;
    return;
  }
  
  try {
    
    const data = await getBookById(bookId);
    book.value = data;
    
    
  } catch (err) {
    console.error('Failed to load book:', err);
    
    // Handle specific error cases
    if (err.response?.status === 404) {
      error.value = 'هذا الكتاب غير موجود';
    } else if (err.response?.status === 401) {
      error.value = 'يرجى تسجيل الدخول للمتابعة';
    } else {
      error.value = err.response?.data?.error || 'حدث خطأ أثناء تحميل الكتاب';
    }
  } finally {
    loading.value = false;
  }
});

// ✅ Navigate to checkout with this book
const handleBuyNow = () => {
  if (!book.value?.id) return;
  
  // Option A: Direct checkout (single book)
  router.push({
    path: '/checkout',
    query: { bookId: book.value.id }
  });
  
  // Option B: If you have a cart later:
  // addToCart(book.value.id);
  // router.push('/cart');
};

// ✅ Optional: Add to wishlist (localStorage for now)
const addToWishlist = () => {
  if (!book.value?.id) return;
  
  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  if (!wishlist.includes(book.value.id)) {
    wishlist.push(book.value.id);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    // Show toast: "تمت الإضافة للمفضلة! ❤️"
  }
};

// ✅ Optional: View related book (for BookCard events)
const viewBook = (bookId) => {
  router.push(`/books/${bookId}`);
};

// ✅ Optional: Fetch related books (same author)
// const fetchRelatedBooks = async (currentBook) => {
//   try {
//     const allBooks = await api.get('/api/books');
//     relatedBooks.value = allBooks.data
//       .filter(b => b.author === currentBook.author && b.id !== currentBook.id)
//       .slice(0, 4); // Show max 4
//   } catch (err) {
//     console.warn('Failed to load related books:', err);
//   }
// };
</script>

<style scoped>
/* Smooth hover transitions */
button {
  @apply transition-all duration-200;
}

/* RTL-friendly text alignment */
p, h1, h2, h3 {
  text-align: right;
}

/* Custom scrollbar for description */
.whitespace-pre-line {
  white-space: pre-line;
  direction: rtl;
}
</style>