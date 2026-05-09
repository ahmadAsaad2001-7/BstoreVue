<script setup>
import { ref, onMounted } from 'vue';
import NavBar from '../components/NavBar.vue';
import { fetchAdminVotes } from '../api/VotesServices.js';

// Reactive state
const votes = ref([]);
const loading = ref(false);
const error = ref(null);
const selectedVote = ref(null); // ✅ Tracks which vote is clicked

// Load all votes on mount
const loadVotes = async () => {
  loading.value = true;
  error.value = null;
  try {
    votes.value = await fetchAdminVotes();
  } catch (err) {
    error.value = err.response?.data?.error || err.message || 'فشل تحميل التصويتات';
  } finally {
    loading.value = false;
  }
};

// ✅ Handle vote click
const selectVote = (vote) => {
  selectedVote.value = vote;
};

// ✅ Helper: Calculate approval percentage
const approvalPct = (vote) => {
  const total = vote.approvalCount + vote.disapprovalCount;
  return total === 0 ? 0 : (vote.approvalCount / total) * 100;
};

// ✅ Helper: Status text & styling
const statusInfo = (vote) => {
  if (vote.isResolved) return { text: 'مغلق', class: 'bg-gray-200 text-gray-700' };
  if (vote.isExpired) return { text: 'منتهي', class: 'bg-red-100 text-red-700' };
  return { text: 'نشط', class: 'bg-green-100 text-green-700' };
};

onMounted(loadVotes);
</script>
<template>
  <NavBar title="مقراء" />

  <div class="flex bg-gray-100 min-h-screen">
    <div class="flex-grow p-6">
      <main class="space-y-6">
        
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">لوحة التحكم</h1>
            <p class="text-gray-500 text-sm">إدارة التصويتات والمحتوى</p>
          </div>
          <!-- Your existing buttons can go here -->
        </div>

        <!-- Interactive Grid: List + Results -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- 📋 LEFT: Vote List -->
          <div class="bg-white shadow rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">🗳️ قائمة التصويتات</h3>
            
            <div v-if="loading" class="text-center py-8 text-gray-400">جاري التحميل...</div>
            <div v-else-if="votes.length === 0" class="text-center py-8 text-gray-400">لا توجد تصويتات</div>
            
            <ul v-else class="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              <li 
                v-for="vote in votes" 
                :key="vote.id"
                @click="selectVote(vote)"
                class="p-3 rounded-lg cursor-pointer transition-all border-2 hover:bg-blue-50"
                :class="selectedVote?.id === vote.id 
                  ? 'bg-blue-100 border-blue-400 shadow-sm' 
                  : 'border-transparent bg-gray-50'"
              >
                <div class="font-medium text-gray-800 truncate">{{ vote.subject }}</div>
                <div class="flex justify-between text-xs mt-1 text-gray-500">
                  <span>✅ {{ vote.approvalCount }}</span>
                  <span>❌ {{ vote.disapprovalCount }}</span>
                  <span :class="statusInfo(vote).class" class="px-2 py-0.5 rounded-full">{{ statusInfo(vote).text }}</span>
                </div>
              </li>
            </ul>
          </div>

          <!-- 📊 RIGHT: Result Query Section -->
          <div class="lg:col-span-2 bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">📊 نتائج الاستفتاء</h3>
            
            <!-- Placeholder (when nothing selected) -->
            <div v-if="!selectedVote" class="flex flex-col items-center justify-center h-80 text-gray-400 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
              <span class="text-5xl mb-3">👆</span>
              <p class="text-lg">اختر تصويتاً من القائمة لعرض النتائج التفصيلية</p>
            </div>

            <!-- ✅ Detailed View (when selected) -->
            <div v-else class="space-y-6 animate-fadeIn">
              <div class="flex justify-between items-start">
                <h2 class="text-2xl font-bold text-gray-800">{{ selectedVote.subject }}</h2>
                <span :class="statusInfo(selectedVote).class" class="px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                  {{ statusInfo(selectedVote).text }}
                </span>
              </div>

              <!-- Progress Bar -->
              <div class="space-y-3">
                <div class="flex justify-between text-sm font-medium">
                  <span class="text-green-600">✅ موافق: {{ selectedVote.approvalCount }}</span>
                  <span class="text-red-600">❌ معارض: {{ selectedVote.disapprovalCount }}</span>
                </div>
                <div class="h-4 bg-gray-200 rounded-full overflow-hidden flex">
                  <div 
                    class="h-full bg-green-500 transition-all duration-700 ease-out"
                    :style="{ width: approvalPct(selectedVote) + '%' }"
                  ></div>
                  <div 
                    class="h-full bg-red-400 transition-all duration-700 ease-out"
                    :style="{ width: (100 - approvalPct(selectedVote)) + '%' }"
                  ></div>
                </div>
                <p class="text-center text-sm text-gray-600">
                  نسبة الموافقة: <span class="font-bold text-green-600">{{ approvalPct(selectedVote).toFixed(1) }}%</span>
                  • إجمالي الأصوات: {{ selectedVote.approvalCount + selectedVote.disapprovalCount }}
                </p>
              </div>

              <!-- Meta Info -->
              <div class="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg border">
                <div>
                  <span class="text-gray-500 block text-xs">تاريخ الانتهاء</span>
                  <span class="font-medium">{{ new Date(selectedVote.expiryDate).toLocaleDateString('ar-EG') }}</span>
                </div>
                <div>
                  <span class="text-gray-500 block text-xs">حالة التصويت</span>
                  <span class="font-medium">{{ selectedVote.canVote ? 'قابل للتصويت' : 'مغلق/منتهي' }}</span>
                </div>
              </div>

              <!-- Action Buttons (Optional: for admin to resolve/close) -->
              <div v-if="!selectedVote.isResolved && !selectedVote.isExpired" class="flex gap-3 pt-4 border-t">
                <button class="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                  إغلاق التصويت
                </button>
                <button class="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition">
                  تصدير النتائج
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Smooth fade-in animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>