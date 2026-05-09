<script setup>
import { ref, onMounted } from 'vue';
import UserCard from './UserCard.vue';
import { GetNearestVendors } from '../api/UserService.js'; 

const users = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const responseData = await GetNearestVendors();
    
    if (responseData && responseData.isSuccess) {
      
      users.value = responseData.value.map(vendor => ({
        id: vendor.vendorId,            
        name: vendor.vendorName,      
        email: "بائع قريب",             
        roles: ["Vendor"],            
        imageUrl: null                
      }));

    } else {
      console.error("Backend returned an error:", responseData.error);
    }

  } catch (error) {
    console.error("Failed to load vendors:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="space-y-4">
    <div v-if="isLoading" class="text-white text-center">جاري البحث عن أقرب البائعين...</div>
    
    <UserCard v-for="user in users" :key="user.id" :user="user" />
    
    <div v-if="!isLoading && users.length === 0" class="text-gray-400 text-center">
      لا يوجد بائعون متاحون بالقرب منك حالياً.
    </div>
  </div>
</template>