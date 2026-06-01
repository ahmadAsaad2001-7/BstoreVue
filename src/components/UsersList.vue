<script setup>
import { ref, onMounted } from "vue"
import UserCard from "./UserCard.vue"
import { GetNearByUsers } from "../api/UserService.js" // تأكد من مسار الملف

// 1. تعريف المتغيرات
const users = ref([])
const isLoading = ref(true)

// 2. جلب البيانات عند تحميل الصفحة
onMounted(async () => {
  try {
    const responseData = await GetNearByUsers();
    console.log("GetNearByUsers response:", responseData);
    
    // Handle both wrapped (with isSuccess) and direct array responses
    let userData = [];
    
    if (responseData && responseData.isSuccess && responseData.value) {
      // Wrapped response format
      userData = responseData.value;
    } else if (responseData && responseData.isSuccess === false && responseData.value) {
      // Error response with data
      userData = responseData.value;
    } else if (Array.isArray(responseData)) {
      // Direct array response
      userData = responseData;
    } else if (responseData && Array.isArray(responseData.data)) {
      // Response with data property
      userData = responseData.data;
    }
    
    if (userData.length > 0) {
      users.value = userData.map(u => ({
        id: u.userId,
        name: u.userName,
        imageUrl: u.imageUrl,
        isSuspended: u.isSuspended,
        email: "مستخدم قريب"
      }));
    } else {
      console.warn("No user data found in response:", responseData);
    }
  } catch (err) {
    console.error("Error loading users:", err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="p-4">
    <div v-if="isLoading" class="text-center text-white py-10">
      جاري تحميل المستخدمين القريبين...
    </div>
    
    <template v-else-if="users.length > 0">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UserCard 
          v-for="user in users" 
          :key="user.id" 
          :user="user"
        />
      </div>
    </template>

    <div v-else class="col-span-full text-center py-20 bg-gray-800/50 rounded-xl border border-gray-700 border-dashed">
      <p class="text-gray-400">لا يوجد مستخدمين متاحين حالياً بالقرب منك.</p>
    </div>
  </div>
</template>