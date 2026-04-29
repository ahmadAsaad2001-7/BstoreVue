<script setup>
import { ref } from 'vue';
import NavBar from '../components/NavBar.vue';
import VoteList from '../components/VoteList.vue';

</script>

<template>
  <NavBar title="مقراء" />
  <div class="flex bg-gray-100 min-h-screen">
    <div class="flex-grow p-6">
      <main class="space-y-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">التصويتات</h1>
            <p class="text-gray-500 text-sm">استعرض التصويتات الحالية والسابقة</p>
          </div>
        </div>

        <VoteList />
      </main>
    </div>
  </div>
</template>