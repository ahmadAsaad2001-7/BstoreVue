<template>
  <div class="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">إنشاء كوبون جديد</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      
      <!-- كود الكوبون -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">كود الكوبون</label>
        <input 
          v-model="coupon.code" 
          type="text" 
          placeholder="مثلاً: SAVE20"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          required
        />
      </div>

      <!-- الكمية -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">الكمية المتاحة</label>
        <input 
          v-model.number="coupon.quantity" 
          type="number" 
          min="1"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">تاريخ انتهاء الصلاحية</label>
        <input 
          v-model="coupon.expiryDate" 
          type="datetime-local" 
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">نسبة الخصم (%)</label>
        <input 
          v-model.number="coupon.Discount_percentage" 
          type="number" 
          step="0.01"
          min="0"
          max="100"
          placeholder="0.00"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      
      <div v-if="errorMessage" class="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="p-3 text-sm text-green-600 bg-green-50 rounded-lg">
        {{ successMessage }}
      </div>

      
      <button 
        type="submit" 
        :disabled="loading"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md disabled:bg-gray-400"
      >
        <span v-if="loading">جاري الحفظ... ⏳</span>
        <span v-else>✅ إضافة الكوبون</span>
      </button>

    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { AddCoupon } from '../api/AdminService.js'; 

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const coupon = reactive({
  code: '',
  quantity: 1,
  expiryDate: '',
  Discount_percentage: 0
});

const handleSubmit = async () => {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const result = await AddCoupon(coupon);
    
    successMessage.value = 'تم إنشاء الكوبون بنجاح!';
    
    Object.assign(coupon, {
      code: '',
      quantity: 1,
      expiryDate: '',
      Discount_percentage: 0
    });
    
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'حدث خطأ أثناء إضافة الكوبون';
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>