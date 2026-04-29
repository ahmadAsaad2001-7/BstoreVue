<!-- views/PaymentSuccess.vue -->
<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../api/UserService';

const route = useRoute();
const router = useRouter();
const status = ref('loading');
const order = ref(null);

onMounted(async () => {
  const orderId = route.query.order_id;
  const sessionId = route.query.session_id;
  const isFree = route.query.free === 'true';
  
  if (isFree) {
    // 🆓 Free order: no need to verify with backend
    status.value = 'success';
    return;
  }
  
  try {
    // 🔍 Verify payment status with backend (optional but recommended)
    const response = await api.get(`/orders/${orderId}`);
    order.value = response.data;
    
    if (response.data.status === 'Paid') {
      status.value = 'success';
    } else {
      status.value = 'pending'; // Webhook hasn't processed yet
    }
  } catch (err) {
    console.error('Failed to verify payment:', err);
    status.value = 'error';
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 p-4">
    <div class="bg-gray-800 p-8 rounded-2xl max-w-md text-center">
      
      <div v-if="status === 'loading'" class="text-white">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent mx-auto mb-4"></div>
        <p>Verifying your payment...</p>
      </div>
      
      <div v-else-if="status === 'success'" class="text-green-400">
        <div class="text-5xl mb-4">✅</div>
        <h2 class="text-2xl font-bold mb-2">Payment Successful!</h2>
        <p class="text-gray-400 mb-6">Your books have been added to your library.</p>
        <router-link to="/userpage/library" class="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg">
          View My Library
        </router-link>
      </div>
      
      <div v-else-if="status === 'pending'" class="text-yellow-400">
        <div class="text-5xl mb-4">⏳</div>
        <h2 class="text-2xl font-bold mb-2">Payment Received</h2>
        <p class="text-gray-400 mb-6">We're confirming your order. This may take a moment.</p>
        <button @click="window.location.reload()" class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
          Refresh Status
        </button>
      </div>
      
      <div v-else class="text-red-400">
        <div class="text-5xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold mb-2">Verification Failed</h2>
        <p class="text-gray-400 mb-6">Please contact support if you were charged but don't see your books.</p>
        <a href="mailto:support@iqraani.com" class="text-yellow-400 underline">Contact Support</a>
      </div>
      
    </div>
  </div>
</template>