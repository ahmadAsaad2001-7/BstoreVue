<script setup>
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { SearchStore } from "../Stores/Search.js";
import UserCard from "../components/UserCard.vue";
import BookCard from "../components/BookCard.vue";

const searchStore = SearchStore();


const { searchQuery, results, isLoading } = storeToRefs(searchStore);


let timeout = null;
watch(searchQuery, () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    searchStore.performSearch();
  }, 500); 
});
</script>

<template>

  <div class="min-h-screen bg-[#0f172a] text-white overflow-x-hidden" dir="rtl">
    
    <div class="search-container p-4 md:p-8">
      

      <div class="relative max-w-2xl mx-auto mb-12 mt-4">
        <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <span class="text-gray-400">🔍</span>
        </div>
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="ابحث عن عنوان كتاب، مؤلف... أو استخدم u/ للبحث عن مستخدم"
          class="w-full p-4 pr-12 bg-gray-900/50 backdrop-blur-md text-white rounded-2xl border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 placeholder:text-gray-500 shadow-2xl"
        />
        

        <div v-if="isLoading" class="absolute left-4 top-1/2 -translate-y-1/2">
          <div class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>


      <div class="results-area max-w-7xl mx-auto">
        

        <transition name="fade">
          <div v-if="results.users && results.users.length > 0" class="mb-12">
            <div class="flex items-center mb-6 gap-3">
              <div class="w-2 h-8 bg-blue-500 rounded-full"></div>
              <h2 class="text-2xl font-bold text-gray-100">المستخدمون القريبون</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <UserCard v-for="u in results.users" :key="u.id" :user="u" />
            </div>
          </div>
        </transition>


        <transition name="fade">
          <div v-if="results.books && results.books.length > 0">
            <div class="flex items-center mb-6 gap-3">
              <div class="w-2 h-8 bg-emerald-500 rounded-full"></div>
              <h2 class="text-2xl font-bold text-gray-100">الكتب المتاحة</h2>
              <span class="text-sm text-gray-500 mr-auto">{{ results.books.length }} نتيجة</span>
            </div>
            
   
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              <BookCard 
                v-for="b in results.books" 
                :key="b.id" 
                :book="b" 
                class="hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </transition>


        <div v-if="searchQuery.length >= 2 && !isLoading && results.users.length === 0 && results.books.length === 0" 
             class="flex flex-col items-center justify-center py-24 px-6 text-center bg-gray-900/20 rounded-3xl border-2 border-dashed border-gray-800">
          <div class="text-6xl mb-4">🙊</div>
          <h3 class="text-xl font-medium text-gray-300 mb-2">عذراً، لم نجد ما تبحث عنه</h3>
          <p class="text-gray-500">جرب كلمات بحث مختلفة أو تأكد من كتابة u/ بشكل صحيح للبحث عن المستخدمين</p>
        </div>
        
      </div>
    </div>
  </div>
</template>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}


::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #0f172a;
}
::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>