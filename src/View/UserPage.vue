
<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Navbar from '../components/NavBar.vue';
import { api } from '../api/UserService';
import { applyForVendor } from '../api/UserService';

const router = useRouter();
const auth = useAuthStore();

const books = ref([]);
const loading = ref(true);
const error = ref(null);

const validBooks = computed(() => 
  books.value.filter(book => book && book.id)
);

onMounted(async () => {
  if (auth.loading) {
    await new Promise(resolve => {
      const check = () => {
        if (!auth.loading) resolve();
        else setTimeout(check, 50);
      };
      check();
    });
  }
  
  if (!auth.isAuthenticated) {
    router.replace('/login');
    return;
  }
  
  await fetchLibrary();
});

watch(
  () => auth.isAuthenticated,
  (newVal) => {
    if (newVal && auth.user?.id) {
      fetchLibrary();
    } else if (!newVal) {
      router.replace('/login');
    }
  }
);
const handleApplyforVendor = async () => {
  error.value = null; 
  
  try {
    const response = await applyForVendor();
   
    alert('تم تقديم طلبك بنجاح! ✅');
    return response;
    
  } catch (err) { 
    console.error('Failed to apply for vendor:', err);
    
    
    const backendError = err.response?.data?.error || err.message;
    error.value = backendError || 'فشل تقديم طلب البائع';
    
      alert(error.value);
  }
};
const fetchLibrary = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await api.get('/user/library');
    

    let libraryData = response.data;
    
    if (response.data?.value && Array.isArray(response.data.value)) {
     
      libraryData = response.data.value;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
    
      libraryData = response.data.data;
    }
    
    books.value = Array.isArray(libraryData) 
      ? libraryData.filter(book => book?.id) 
      : [];
      
  } catch (err) {
    console.error('Failed to fetch library:', err);
    
    if (err.response?.status === 401 || err.response?.status === 403) {
      auth.logout();
      router.replace('/login');
      return;
    }
    
    error.value = err.response?.data?.error || 
                  err.response?.data?.message ||
                  err.message || 
                  'فشل تحميل المكتبة. حاول مرة أخرى لاحقاً.';
  } finally {
    loading.value = false;
  }
};

const handleAddBook = () => {
  router.push('/store');
};

const handleReadBook = (bookId) => {
  if (bookId) {
    router.push(`/reader/${bookId}`);
  }
};
</script>

<template>
  <Navbar title="مكتبتي الشخصية" />

  
  <div v-if="auth.loading || loading" class="fixed inset-0 bg-gray-900/90 flex items-center justify-center z-50">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent mx-auto mb-4"></div>
      <p class="text-white text-lg">جاري تحميل مكتبتك...</p>
    </div>
  </div>

  <div v-else-if="auth.isAuthenticated" class="bg-purple-600 w-full h-[100dvh] flex items-start overflow-hidden">
    
    <!-- Sidebar -->
    <aside class="rounded-b-2xl bg-gradient-to-b from-green-300 to-green-200 h-full w-[15%] min-w-[140px] flex flex-col items-center justify-start p-4 shadow-lg border-r border-green-400/30">
      <div class="relative mb-4">
        <img 
          class="h-20 w-20 rounded-full object-cover border-4 border-white/80 shadow-md" 
          alt="user avatar" 
          :src="auth.user?.imageUrl || 'https://www.svgrepo.com/show/492788/book-and-person-winter.svg'"
        >
        <span class="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white" title="نشط"></span>
      </div>
      
      <h2 class="text-white text-lg font-bold text-center mb-1 truncate w-full">
        {{ auth.user?.name || 'مستخدم' }}
      </h2>
      
      <p class="text-green-900/80 text-xs text-center mb-4 truncate w-full">
        {{ auth.user?.email || 'user@example.com' }}
      </p>
      
      <div class="w-full bg-white/20 rounded-lg p-3 text-center">
        <p class="text-white text-xs">عدد الكتب</p>
        <p class="text-white text-xl font-bold">{{ validBooks.length }}</p>
      </div>

<div v-if="auth.isAuthenticated && !auth.isVendor" class="w-full bg-white/20 rounded-lg p-3 text-center mt-3">
      <p class="text-xs mb-2">التقديم كبائع</p>
    <p v-if="error" class="text-red-400 text-xs mb-2">{{ error }}</p>
    <button
      @click="handleApplyforVendor"
      class="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors shadow"
    >
      ➕ تقديم الطلب
    </button>
    
  </div>

  
  <div v-else class="mt-3">
    <router-link to="/AddBook">
      <button
        type="button"
        class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center"
      >
        ➕ إضافة كتاب
      </button>
    </router-link>

     
    
  </div>
  
</aside>

    <!-- Content Area -->
    <main class="bg-yellow-800 w-[85%] h-full overflow-y-auto p-4 md:p-6 scroll-smooth">
      
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-xl md:text-2xl font-bold text-white mb-1">📚 مكتبتي الشخصية</h1>
          <p class="text-yellow-200/90 text-sm">
            {{ validBooks.length }} كتاب {{ validBooks.length === 1 ? 'مقتنى' : 'مقتناة' }}
          </p>
        </div>
     
      </div>

      <!-- Error State -->
      <div v-if="error" class="flex flex-col items-center justify-center h-64 text-center">
        <span class="text-4xl mb-3">⚠️</span>
        <p class="text-white font-medium mb-2">{{ error }}</p>
        <button @click="fetchLibrary" class="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm transition">
          إعادة المحاولة
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="validBooks.length === 0" class="flex flex-col items-center justify-center h-64 text-center">
        <span class="text-5xl mb-3">📭</span>
        <p class="text-white font-medium mb-1">لا توجد كتب في مكتبتك بعد</p>
        <p class="text-yellow-200/80 text-sm mb-4">ابدأ باستكشاف المتجر لإضافة كتبك الأولى</p>
        <button @click="router.push('/')" class="px-5 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm transition shadow">
          تصفح المتجر
        </button>
      </div>

      <!-- ✅ Book Cards Grid - FIXED: Use validBooks + defensive key -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        <div 
          v-for="book in validBooks" 
          :key="book.id" 
          class="group bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-700/50 hover:border-yellow-400 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
          @click="handleReadBook(book.id)"
        >
          <!-- Book Cover -->
          <div class="relative h-40 bg-gradient-to-br from-yellow-700/40 to-yellow-800/60 rounded-lg mb-4 flex items-center justify-center overflow-hidden group-hover:scale-[1.02] transition-transform">
            <img 
              v-if="book.coverUrl" 
              :src="book.coverUrl" 
              :alt="book.title"
              class="absolute inset-0 w-full h-full object-cover"
            >
            <span v-else class="text-yellow-200 text-4xl opacity-60">📖</span>
            
            <span class="absolute top-2 right-2 bg-yellow-500/90 text-white text-[10px] px-2 py-0.5 rounded-full shadow">
              مُقتنى
            </span>
          </div>
          
          <!-- Book Info - Defensive null checks -->
          <h3 class="font-bold text-white mb-1 line-clamp-1" :title="book.title || ''">
            {{ book.title || 'عنوان الكتاب' }}
          </h3>
          <p class="text-yellow-100/70 text-xs mb-3 line-clamp-2" :title="book.author || ''">
            {{ book.author || 'مؤلف غير معروف' }}
          </p>
          
          <!-- Purchase Date -->
          <div class="flex items-center gap-1 text-[10px] text-yellow-200/80 mb-3">
            <span>🕒</span>
            <span>{{ book.purchaseDate ? new Date(book.purchaseDate).toLocaleDateString('ar-EG') : 'تاريخ غير محدد' }}</span>
          </div>
          
          <!-- Actions -->
          <div class="flex gap-2">
            <button 
              @click.stop="handleReadBook(book.id)"
              class="flex-1 py-1.5 px-2 bg-yellow-600/90 hover:bg-yellow-500 text-white text-[11px] rounded-lg transition-colors"
            >
              قراءة
            </button>
            <button 
              class="p-1.5 bg-white/10 hover:bg-white/20 text-yellow-100 rounded-lg transition-colors" 
              title="مزيد من الخيارات"
              @click.stop
            >
              ⋮
            </button>
          </div>
        </div>
      </div>

      <div v-if="validBooks.length >= 12" class="mt-8 text-center">
        <button class="px-6 py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded-full text-sm transition-colors shadow">
          تحميل المزيد ↓
        </button>
      </div>

    </main>
  </div>
</template>

<style scoped>

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
main::-webkit-scrollbar { width: 6px; }
main::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); border-radius: 3px; }
main::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 3px; }
main::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.5); }
</style>