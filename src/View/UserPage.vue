<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../Stores/Auth.js';
import Navbar from '../components/NavBar.vue';
import { api } from '../api/UserService.js';
import { applyForVendor } from '../api/UserService.js';

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
    // Refresh auth to update vendor status
    await auth.checkAuth();
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
  <div class="min-h-screen bg-brand-bg flex flex-col" dir="rtl">
    <Navbar title="مكتبتي الشخصية" />

    <div v-if="auth.loading || loading" class="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
      <div class="text-center font-bold text-brand-text text-xl">
        جاري تحميل مكتبتك...
      </div>
    </div>

    <div v-else-if="auth.isAuthenticated" class="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full border-x border-gray-300">
      
      <!-- Sidebar -->
      <aside class="w-full md:w-64 bg-white border-b md:border-b-0 md:border-l border-gray-300 p-6 flex flex-col items-center shrink-0">
        <div class="mb-4">
          <img 
            class="h-24 w-24 rounded-full object-cover border-4 border-brand-text" 
            alt="user avatar" 
            :src="auth.user?.imageUrl || 'https://www.svgrepo.com/show/492788/book-and-person-winter.svg'"
          >
        </div>
        
        <h2 class="text-brand-text text-xl font-black text-center mb-1 w-full truncate">
          {{ auth.user?.name || 'مستخدم' }}
        </h2>
        
        <p class="text-gray-500 text-sm font-bold text-center mb-6 w-full truncate">
          {{ auth.user?.email || 'user@example.com' }}
        </p>
        
        <div class="w-full bg-gray-50 border border-gray-300 p-4 text-center mb-6">
          <p class="text-gray-500 font-bold text-sm">عدد الكتب</p>
          <p class="text-brand-text text-3xl font-black">{{ validBooks.length }}</p>
        </div>

        <div v-if="auth.isAuthenticated && !auth.isVendor" class="w-full text-center">
          <p v-if="error" class="text-red-600 font-bold text-sm mb-2">{{ error }}</p>
          <button
            @click="handleApplyforVendor"
            class="w-full px-4 py-3 bg-brand-text hover:bg-gray-800 disabled:opacity-50 text-white font-bold rounded-full transition-colors"
          >
            التقديم كبائع
          </button>
        </div>
        
        <div v-else class="w-full">
          <router-link to="/AddBook" class="block w-full">
            <button
              type="button"
              class="w-full px-4 py-3 bg-brand-accent hover:opacity-90 disabled:opacity-50 text-brand-text font-black rounded-full transition-colors border border-brand-text"
            >
              إضافة كتاب
            </button>
          </router-link>
        </div>
      </aside>

      <!-- Content Area -->
      <main class="flex-1 bg-brand-bg p-6 md:p-10">
        
        <!-- Header -->
        <div class="mb-8 border-b border-gray-300 pb-4">
          <h1 class="text-3xl font-extrabold text-brand-text">مكتبتي الشخصية</h1>
        </div>

        <!-- Error State -->
        <div v-if="error" class="flex flex-col items-center justify-center py-20 text-center">
          <span class="text-5xl mb-4">⚠️</span>
          <p class="text-red-600 font-bold text-lg mb-4">{{ error }}</p>
          <button @click="fetchLibrary" class="px-6 py-2 bg-brand-text text-brand-bg font-bold rounded-full">
            إعادة المحاولة
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="validBooks.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
          <span class="text-6xl mb-4">📭</span>
          <p class="text-brand-text font-extrabold text-2xl mb-2">لا توجد كتب في مكتبتك بعد</p>
          <p class="text-gray-500 font-bold mb-6">ابدأ باستكشاف المتجر لإضافة كتبك الأولى</p>
          <button @click="router.push('/')" class="px-8 py-3 bg-brand-text text-brand-bg font-black rounded-full hover:opacity-80">
            تصفح المتجر
          </button>
        </div>

        <!-- Book Cards Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="book in validBooks" 
            :key="book.id" 
            class="group bg-white border border-gray-300 p-4 hover:border-brand-text hover:shadow-md transition-all cursor-pointer flex flex-col"
            @click="handleReadBook(book.id)"
          >
            <!-- Book Cover -->
            <div class="relative h-48 bg-gray-100 mb-4 border border-gray-200 overflow-hidden">
              <img 
                v-if="book.coverUrl" 
                :src="book.coverUrl" 
                :alt="book.title"
                class="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
              >
              <div v-else class="absolute inset-0 flex items-center justify-center text-4xl text-gray-300">📖</div>
              <span class="absolute top-2 right-2 bg-brand-accent text-brand-text text-xs font-bold px-2 py-1 border border-brand-text">
                مُقتنى
              </span>
            </div>
            
            <!-- Book Info -->
            <div class="flex-1">
              <h3 class="font-extrabold text-brand-text mb-1 line-clamp-1" :title="book.title || ''">
                {{ book.title || 'عنوان الكتاب' }}
              </h3>
              <p class="text-gray-500 text-sm font-medium mb-3 line-clamp-1" :title="book.author || ''">
                {{ book.author || 'مؤلف غير معروف' }}
              </p>
            </div>
            
            <!-- Actions -->
            <div class="pt-4 border-t border-gray-200">
              <button 
                @click.stop="handleReadBook(book.id)"
                class="w-full py-2 bg-brand-text text-brand-bg font-bold rounded-none hover:bg-gray-800 transition-colors text-sm"
              >
                قراءة الكتاب
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>