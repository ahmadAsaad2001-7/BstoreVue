<template>
  <div class="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center gap-4 hover:bg-gray-750 transition">
    <img 
      :src="user.imageUrl || 'https://www.svgrepo.com/show/492788/book-and-person-winter.svg'" 
      class="w-14 h-14 rounded-full object-cover border-2 border-gray-600"
    />
    <div class="flex-1">
      <h4 class="text-white font-bold">{{ user.name || user.userName }}</h4>
      <p class="text-gray-400 text-xs">{{ user.email }}</p>
    </div>
    
    <div class="flex flex-col gap-1">
      <span v-for="role in user.roles" :key="role" class="px-2 py-1 text-[10px] bg-purple-500/20 text-purple-300 rounded border border-purple-500/30 text-center">
        {{ role }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  }
});
</script>