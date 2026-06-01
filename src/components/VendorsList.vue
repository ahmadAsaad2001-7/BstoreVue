<script setup>
import { ref, onMounted } from 'vue';
import UserCard from './UserCard.vue';
import { GetNearestVendors } from '../api/UserService.js'; 

const users = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const responseData = await GetNearestVendors();
    console.log("GetNearestVendors response:", responseData);
    
    // Handle both wrapped (with isSuccess) and direct array responses
    let vendorData = [];
    
    if (responseData && responseData.isSuccess && responseData.value) {
      // Wrapped response format
      vendorData = responseData.value;
    } else if (responseData && responseData.isSuccess === false && responseData.value) {
      // Error response with data
      vendorData = responseData.value;
    } else if (Array.isArray(responseData)) {
      // Direct array response
      vendorData = responseData;
    } else if (responseData && Array.isArray(responseData.data)) {
      // Response with data property
      vendorData = responseData.data;
    }
    
    if (vendorData.length > 0) {
      users.value = vendorData.map(vendor => ({
        id: vendor.vendorId,            
        name: vendor.vendorName,      
        email: "بائع قريب",             
        roles: ["Vendor"],            
        imageUrl: null                
      }));
    } else {
      console.warn("No vendor data found in response:", responseData);
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