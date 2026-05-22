<template>
  <div class="min-h-screen bg-brand-bg p-4 md:p-8" dir="rtl">
    
    <button 
      @click="router.back()" 
      class="mb-6 flex items-center gap-2 text-gray-500 hover:text-brand-text transition-colors font-bold"
    >
      <span>←</span>
      <span>العودة</span>
    </button>

    <div v-if="loading" class="max-w-5xl mx-auto opacity-70">
      Loading...
    </div>

    <div v-else-if="error" class="max-w-2xl mx-auto text-center py-16">
      <div class="text-6xl mb-4">⚠️</div>
      <h2 class="text-2xl font-bold text-brand-text mb-2">عذرًا، لم نتمكن من تحميل الكتاب</h2>
      <p class="text-gray-500 mb-6">{{ error }}</p>
      <button 
        @click="router.back()" 
        class="px-6 py-3 bg-brand-text text-brand-bg rounded-full font-bold hover:opacity-80 transition-opacity"
      >
        العودة للصفحة السابقة
      </button>
    </div>

    <div v-else-if="book" class="max-w-5xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        <!-- 🖼️ Book Image -->
        <div class="relative group">
          <div class="bg-white p-4 border border-gray-300">
            <img 
              :src="book.imageUrl || 'https://www.svgrepo.com/show/492785/book-and-person-summer.svg'" 
              :alt="book.name"
              class="w-full h-auto max-h-[500px] object-contain transition-transform group-hover:scale-[1.02]"
            >
            <div v-if="book.price < 20" class="absolute top-8 right-8 bg-brand-accent text-brand-text px-4 py-1 rounded-full text-sm font-bold shadow-sm border border-brand-text">
              Sale
            </div>
          </div>
        </div>

        <!-- 📝 Book Info -->
        <div class="space-y-6">
          <div>
            <h1 class="text-3xl md:text-5xl font-extrabold text-brand-text mb-3 leading-tight">{{ book.name }}</h1>
            <p class="text-lg font-medium text-gray-500 mb-4">
              بواسطة <span class="text-brand-text">{{ book.author || 'غير معروف' }}</span>
            </p>
          </div>

          <!-- Price -->
          <div class="flex items-end gap-4 border-y border-gray-300 py-6">
            <span class="text-4xl font-black text-brand-text">${{ Number(book.price).toFixed(2) }}</span>
            <span v-if="book.originalPrice" class="text-xl text-gray-400 line-through font-bold mb-1">
              ${{ Number(book.originalPrice).toFixed(2) }}
            </span>
          </div>

          <!-- Description -->
          <div class="py-4">
            <h3 class="text-lg font-bold text-brand-text mb-3">نبذة عن الكتاب</h3>
            <p class="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
              {{ book.description || 'لا توجد نبذة متاحة لهذا الكتاب.' }}
            </p>
          </div>

          <div v-if="book.vendorName" class="bg-white p-4 border border-gray-300">
            <p class="text-sm">
              <span class="text-gray-500 font-bold">بائع:</span> 
              <span class="text-brand-text font-bold mr-2">{{ book.vendorName }}</span>
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              @click="handleBuyNow"
              class="flex-1 py-4 px-6 bg-brand-text text-brand-bg font-extrabold text-lg rounded-full hover:opacity-80 transition-opacity"
            >
              شراء الآن
            </button>
            <button 
              @click="addToWishlist"
              class="flex-1 py-4 px-6 bg-transparent border-2 border-brand-text text-brand-text font-bold text-lg rounded-full hover:bg-gray-100 transition-colors"
            >
              إضافة للمفضلة
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getBookById } from '../api/BookService.js';
import BookCard from '../components/BookCard.vue';

const route = useRoute();
const router = useRouter();

const book = ref(null);
const loading = ref(true);
const error = ref(null);

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

const handleBuyNow = () => {
  if (!book.value?.id) return;
  router.push({
    path: '/checkout',
    query: { bookId: book.value.id }
  });
};

const addToWishlist = () => {
  if (!book.value?.id) return;
  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  if (!wishlist.includes(book.value.id)) {
    wishlist.push(book.value.id);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }
};
</script>