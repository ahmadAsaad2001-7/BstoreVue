<template>
  <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-md hover:shadow-lg hover:border-yellow-400 transition-all flex flex-col h-full">
    
    <div class="flex justify-between items-start mb-3">
      <h3 class="text-gray-900 font-bold text-lg line-clamp-2 flex-1">{{ vote.subject }}</h3>
      
      <div class="flex flex-col gap-1 items-end ms-3">
        <span v-if="vote.isResolved" class="px-2 py-1 text-[10px] font-bold bg-green-100 text-green-700 rounded-md border border-green-200">
          محسوم ✅
        </span>
        <span v-else-if="vote.isExpired" class="px-2 py-1 text-[10px] font-bold bg-red-100 text-red-700 rounded-md border border-red-200">
          منتهي الصلاحية ⏳
        </span>
        <span v-else class="px-2 py-1 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-md border border-blue-200">
          قيد التصويت 🔄
        </span>
      </div>
    </div>

    <div class="text-gray-500 text-xs mb-4 flex items-center gap-1 font-medium">
      <span>📅</span> تنتهي في: {{ new Date(vote.expiryDate).toLocaleDateString('ar-EG') }}
    </div>

    <div class="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
      <div class="flex justify-between text-xs mb-1 font-bold">
        <span class="text-green-600">موافق ({{ vote.approvalCount }})</span>
        <span class="text-red-600">مرفوض ({{ vote.disapprovalCount }})</span>
      </div>
      <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden flex">
        <div :style="{ width: approvalPercentage + '%' }" class="bg-green-500 h-full transition-all"></div>
        <div :style="{ width: disapprovalPercentage + '%' }" class="bg-red-500 h-full transition-all"></div>
      </div>
    </div>

    <div class="flex-grow"></div>

    <div class="mt-4 pt-4 border-t border-gray-100">
      <div v-if="vote.canVote" class="flex gap-2">
        <button 
          @click="$emit('vote', { id: vote.id, isApproved: true })" 
          class="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
        >
          موافقة 👍
        </button>
        <button 
          @click="$emit('vote', { id: vote.id, isApproved: false })" 
          class="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
        >
          رفض 👎
        </button>
      </div>
      
      <div v-else-if="vote.hasVoted" class="text-center text-yellow-700 text-sm font-bold bg-yellow-50 py-2 rounded-lg border border-yellow-200">
        لقد قمت بالتصويت مسبقاً 🗳️
      </div>
      
      <div v-else class="text-center text-gray-500 text-sm py-2 font-bold bg-gray-50 rounded-lg border border-gray-100">
        التصويت مغلق 🔒
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  vote: {
    type: Object,
    required: true
  }
});


defineEmits(['vote']);

const totalVotes = computed(() => props.vote.approvalCount + props.vote.disapprovalCount);
const approvalPercentage = computed(() => totalVotes.value === 0 ? 0 : (props.vote.approvalCount / totalVotes.value) * 100);
const disapprovalPercentage = computed(() => totalVotes.value === 0 ? 0 : (props.vote.disapprovalCount / totalVotes.value) * 100);
</script>