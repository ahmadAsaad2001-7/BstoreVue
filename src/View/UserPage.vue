<!-- views/UserLibrary.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '../components/NavBar.vue';
import { ProfileInfo, UserBooks } from '../api/UserService'; // ✅ Fixed import

const books = ref([]);
const userInfo = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    // ✅ Fetch user info first
    const profileData = await ProfileInfo(); // ✅ Fixed: ProfileInfo (capital P)
    userInfo.value = profileData;
    
    // ✅ Then fetch their library books
    const userBooks = await UserBooks(profileData.id);
    books.value = userBooks || [];
  } catch (err) {
    console.error('Failed to fetch user data:', err);
    error.value = err?.message || 'فشل تحميل البيانات. تأكد من تشغيل الخادم.';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <!-- Navbar -->
  <Navbar title="مكتبتي الشخصية" />

  <!-- Main Layout -->
  <div class="bg-purple-600 w-full h-[100dvh] flex items-start overflow-hidden">
    
    <!-- ✅ Left Sidebar: User Info (15%) -->
    <aside class="rounded-b-2xl bg-gradient-to-b from-green-300 to-green-200 h-full w-[15%] min-w-[140px] flex flex-col items-center justify-start p-4 shadow-lg border-r border-green-400/30">
      <!-- Avatar -->
      <div class="relative mb-4">
        <img 
          class="h-20 w-20 rounded-full object-cover border-4 border-white/80 shadow-md" 
          alt="user avatar" 
          :src="userInfo?.avatar || 'https://www.svgrepo.com/show/492788/book-and-person-winter.svg'"
        >
        <span class="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white" title="نشط"></span>
      </div>
      
      <!-- User Name -->
      <h2 class="text-white text-lg font-bold text-center mb-1 truncate w-full">
        {{ userInfo?.name || 'مستخدم' }}
      </h2>
      
      <!-- Email (optional) -->
      <p class="text-green-900/80 text-xs text-center mb-4 truncate w-full">
        {{ userInfo?.email || 'user@example.com' }}
      </p>
      
      <!-- Stats -->
      <div class="w-full bg-white/20 rounded-lg p-3 text-center">
        <p class="text-white text-xs">عدد الكتب</p>
        <p class="text-white text-xl font-bold">{{ books.length }}</p>
      </div>
      
      <!-- Decorative bottom -->
      <div class="mt-auto w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"></div>
    </aside>

    <!-- ✅ Right Content: User's Library Books (85%) -->
    <main class="bg-yellow-800 w-[85%] h-full overflow-y-auto p-4 md:p-6 scroll-smooth">
      
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-xl md:text-2xl font-bold text-white mb-1">📚 مكتبتي الشخصية</h1>
          <p class="text-yellow-200/90 text-sm">
            {{ books.length }} كتاب {{ books.length === 1 ? 'مقتنى' : 'مقتناة' }}
          </p>
        </div>
        <!-- Optional: Add Book Button -->
        <button class="hidden md:flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white text-sm rounded-lg transition-colors shadow">
          <span>➕</span> إضافة كتاب
        </button>
      </div>

      <!-- 🔄 Loading State -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div v-for="i in 6" :key="i" class="bg-white/10 rounded-xl p-4 animate-pulse border border-yellow-700/30">
          <div class="h-32 bg-yellow-700/40 rounded-lg mb-3"></div>
          <div class="h-4 bg-yellow-700/40 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-yellow-700/30 rounded w-1/2"></div>
        </div>
      </div>

      <!-- ❌ Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center h-64 text-center">
        <span class="text-4xl mb-3">⚠️</span>
        <p class="text-white font-medium mb-2">{{ error }}</p>
        <button @click="window.location.reload()" class="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm transition">
          إعادة المحاولة
        </button>
      </div>

      <!-- ✅ Empty State -->
      <div v-else-if="books.length === 0" class="flex flex-col items-center justify-center h-64 text-center">
        <span class="text-5xl mb-3">📭</span>
        <p class="text-white font-medium mb-1">لا توجد كتب في مكتبتك بعد</p>
        <p class="text-yellow-200/80 text-sm mb-4">ابدأ باستكشاف المتجر لإضافة كتبك الأولى</p>
        <button class="px-5 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm transition shadow">
          تصفح المتجر
        </button>
      </div>

      <!-- 🃏 Book Cards Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        <div 
          v-for="book in books" 
          :key="book.id"
          class="group bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-700/50 hover:border-yellow-400 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        >
          <!-- Book Cover Placeholder -->
          <div class="relative h-40 bg-gradient-to-br from-yellow-700/40 to-yellow-800/60 rounded-lg mb-4 flex items-center justify-center overflow-hidden group-hover:scale-[1.02] transition-transform">
            <!-- Optional: If book has cover URL -->
            <img 
              v-if="book.coverUrl" 
              :src="book.coverUrl" 
              :alt="book.title"
              class="absolute inset-0 w-full h-full object-cover"
            >
            <!-- Fallback icon -->
            <span v-else class="text-yellow-200 text-4xl opacity-60">📖</span>
            
            <!-- Purchase Badge -->
            <span class="absolute top-2 right-2 bg-yellow-500/90 text-white text-[10px] px-2 py-0.5 rounded-full shadow">
              مُقتنى
            </span>
          </div>
          
          <!-- Book Info -->
          <h3 class="font-bold text-white mb-1 line-clamp-1" :title="book.title">
            {{ book.title || 'عنوان الكتاب' }}
          </h3>
          <p class="text-yellow-100/70 text-xs mb-3 line-clamp-2" :title="book.author">
            {{ book.author || 'مؤلف غير معروف' }}
          </p>
          
          <!-- Purchase Date -->
          <div class="flex items-center gap-1 text-[10px] text-yellow-200/80 mb-3">
            <span>🕒</span>
            <span>{{ book.purchaseDate ? new Date(book.purchaseDate).toLocaleDateString('ar-EG') : 'تاريخ غير محدد' }}</span>
          </div>
          
          <!-- Actions -->
          <div class="flex gap-2">
            <button class="flex-1 py-1.5 px-2 bg-yellow-600/90 hover:bg-yellow-500 text-white text-[11px] rounded-lg transition-colors">
              قراءة
            </button>
            <button class="p-1.5 bg-white/10 hover:bg-white/20 text-yellow-100 rounded-lg transition-colors" title="مزيد من الخيارات">
              ⋮
            </button>
          </div>
        </div>
      </div>

      <!-- Load More (if paginated) -->
      <div v-if="books.length >= 12" class="mt-8 text-center">
        <button class="px-6 py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded-full text-sm transition-colors shadow">
          تحميل المزيد ↓
        </button>
      </div>

    </main>
  </div>
</template>

<style scoped>
/* Smooth scrollbar for dark theme */
main::-webkit-scrollbar {
  width: 6px;
}
main::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}
main::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}
main::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* RTL-friendly text truncation */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>