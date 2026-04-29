<script setup>
import { ref, computed, onMounted } from 'vue';
import VoteCard from '../components/VoteCard.vue';
import UserCard from '../components/UserCard.vue';


import { fetchAdminVotes, castAdminVote } from '../api/VotesServices'; 

const currentTab = ref('active');
const loading = ref(false);
const votes = ref([]);
const users = ref([]);

const filteredVotes = computed(() => {
  if (currentTab.value === 'active') {
    return votes.value.filter(v => !v.isResolved && !v.isExpired);
  } else if (currentTab.value === 'finished') {
    return votes.value.filter(v => v.isResolved || v.isExpired);
  }
  return [];
});

// 1. استخدام دالة جلب البيانات الخاصة بك
const fetchData = async () => {
  loading.value = true;
  try {
    const data = await fetchAdminVotes();
    // إذا كانت الـ API ترجع النتيجة بداخل Value استخدم: data.value
    votes.value = data.value || data; 
  } catch (error) {
    console.error("Error fetching admin votes:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

// 2. استخدام دالة التصويت الخاصة بك
const handleVoteAction = async ({ id, isApproved }) => {
  try {
    // إرسال الـ API Request
    await castAdminVote(id, isApproved);
    
    // إعادة تحميل البيانات لتحديث الأرقام وحالة التصويت في البطاقة
    await fetchData();
  } catch (error) {
    console.error("Failed to cast vote:", error);
    // يمكنك إضافة Alert أو Notification هنا لإبلاغ المستخدم بالخطأ
  }
};
</script>
<template>
  <div class="min-h-screen bg-gray-900 p-4 md:p-8" dir="rtl">
    <div class="max-w-7xl mx-auto">
      
      <div class="bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg border border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white mb-1">🛡️ لوحة تحكم الإدارة</h1>
          <p class="text-gray-400 text-sm">إدارة طلبات البائعين والمستخدمين</p>
        </div>
        
        <div class="flex bg-gray-900 p-1 rounded-xl border border-gray-700">
          <button 
            @click="currentTab = 'active'"
            :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', currentTab === 'active' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white']"
          >
            طلبات قيد التنفيذ
          </button>
          <button 
            @click="currentTab = 'finished'"
            :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', currentTab === 'finished' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white']"
          >
            طلبات منتهية
          </button>
          <button 
            @click="currentTab = 'users'"
            :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', currentTab === 'users' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white']"
          >
            قائمة المستخدمين
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent mx-auto mb-4"></div>
        <p class="text-gray-400">جاري تحميل البيانات...</p>
      </div>

      <div v-else>
        <div v-if="currentTab === 'active' || currentTab === 'finished'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <template v-if="filteredVotes.length > 0">
            <VoteCard 
              v-for="vote in filteredVotes" 
              :key="vote.id" 
              :vote="vote" 
              @vote="handleVoteAction"
            />
          </template>
          <div v-else class="col-span-full text-center py-20 bg-gray-800/50 rounded-xl border border-gray-700 border-dashed">
            <p class="text-gray-400">لا توجد طلبات تصويت مطابقة.</p>
          </div>
        </div>

        <div v-if="currentTab === 'users'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <template v-if="users.length > 0">
            <UserCard 
              v-for="user in users" 
              :key="user.id" 
              :user="user"
            />
          </template>
          <div v-else class="col-span-full text-center py-20 bg-gray-800/50 rounded-xl border border-gray-700 border-dashed">
            <p class="text-gray-400">لا يوجد مستخدمين لعرضهم.</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

