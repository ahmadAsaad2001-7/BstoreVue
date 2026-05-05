<!-- 📁 views/Checkout.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-gray-800 p-4" dir="rtl">
    <div class="max-w-2xl mx-auto">
      
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">🛒 تأكيد الطلب</h1>
        <p class="text-gray-400">راجع تفاصيل طلبك قبل المتابعة</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-gray-800/90 rounded-2xl p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent mx-auto mb-4"></div>
        <p class="text-white">جاري تحميل تفاصيل الكتاب...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
        <p class="text-red-300 mb-4">⚠️ {{ error }}</p>
        <button @click="router.back()" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
          العودة
        </button>
      </div>

      <!-- Order Summary (when book loaded) -->
      <div v-else-if="book" class="space-y-6">
        
        <!-- Book Card -->
        <div class="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div class="flex gap-4">
            <img 
              :src="book.imageUrl || 'https://www.svgrepo.com/show/492785/book-and-person-summer.svg'" 
              :alt="book.name"
              class="w-24 h-32 object-cover rounded-lg"
            >
            <div class="flex-1">
              <h2 class="text-xl font-bold text-white mb-2">{{ book.name }}</h2>
              <p class="text-gray-400 text-sm mb-3">{{ book.author }}</p>
              <div class="flex items-center gap-2">
                <span class="text-2xl font-bold text-yellow-400">${{ Number(book.price).toFixed(2) }}</span>
                <span v-if="couponDiscountPercent > 0" class="text-sm text-green-400">
                  (وفر ${{ (book.price * couponDiscountPercent / 100).toFixed(2) }})
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Coupon Code Input -->
        <div class="bg-gray-800/90 rounded-xl p-4 border border-gray-700/50">
          <label class="block text-gray-300 text-sm font-medium mb-2">كود الخصم (اختياري)</label>
          <div class="flex gap-2">
            <input 
              v-model="couponCode"
              type="text"
              placeholder="أدخل كود الخصم"
              class="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              @keyup.enter="applyCoupon"
            >
            <button 
              @click="applyCoupon"
              :disabled="applyingCoupon"
              class="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {{ applyingCoupon ? 'جاري...' : 'تطبيق' }}
            </button>
          </div>
          <p v-if="couponError" class="text-red-400 text-xs mt-2">{{ couponError }}</p>
          <p v-if="couponSuccess" class="text-green-400 text-xs mt-2">{{ couponSuccess }}</p>
        </div>

        <!-- Order Total -->
        <div class="bg-gray-800/90 rounded-xl p-4 border border-gray-700/50">
          <div class="flex justify-between text-gray-300 mb-2">
            <span>السعر الأصلي:</span>
            <span>${{ Number(book.price).toFixed(2) }}</span>
          </div>
          <div v-if="couponDiscountPercent > 0" class="flex justify-between text-green-400 mb-2">
            <span>الخصم:</span>
            <span>-${{ (book.price * couponDiscountPercent / 100).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-white font-bold text-lg pt-2 border-t border-gray-700">
            <span>الإجمالي:</span>
            <span class="text-yellow-400">${{ finalPrice.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Confirm Button -->
        <button 
          @click="handleCheckout"
          :disabled="isCheckingOut"
          class="w-full py-4 px-6 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
        >
          <span v-if="isCheckingOut" class="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></span>
          {{ isCheckingOut ? 'جاري معالجة الطلب...' : 'تأكيد ودفع' }}
        </button>

        <!-- Security Note -->
        <p class="text-center text-gray-500 text-xs mt-4">
          🔒 الدفع آمن عبر Stripe • لا نحتفظ بمعلومات بطاقتك
        </p>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getBookById } from '../api/BookService';
import { processPayment, ValidateCoupon } from '../api/PaymentService';

const route = useRoute();
const router = useRouter();

// State
const book = ref(null);
const loading = ref(true);
const error = ref(null);
const couponCode = ref('');
const applyingCoupon = ref(false);
const couponError = ref(null);
const couponSuccess = ref(null);
const isCheckingOut = ref(false);
const couponDiscountPercent = ref(0);
onMounted(async () => {
  const bookId = route.query.bookId;
  
  if (!bookId) {
    error.value = 'لم يتم تحديد الكتاب';
    loading.value = false;
    return;
  }
  
  try {
    const data = await getBookById(bookId);
    book.value = data;
  } catch (err) {
    error.value = 'فشل تحميل تفاصيل الكتاب';
    console.error('Failed to load book:', err);
  } finally {
    loading.value = false;
  }
});



const finalPrice = computed(() => {
  if (!book.value) return 0;
  const discount = (book.value.price * (couponDiscountPercent.value / 100));
  return book.value.price - discount;
});

const applyCoupon = async () => {
  if (!couponCode.value.trim()) return;
  
  applyingCoupon.value = true;
  couponError.value = null;
  couponSuccess.value = null;
  
    try {
    const couponData = await ValidateCoupon(couponCode.value.trim());
    

    couponDiscountPercent.value = 
      couponData.discountPercentage  // camelCase (المفضل)
      || couponData.Discount_percentage  // PascalCase مع underscore
      || couponData.discount_percentage  // snake_case
      || 0;
      
    couponSuccess.value = `تم تطبيق خصم ${couponDiscountPercent.value}% بنجاح! ✅`;
  } catch (err) {
    couponDiscountPercent.value = 0;
    couponError.value = typeof err === 'string' ? err : 'كود الخصم غير صالح';
  } finally {
    applyingCoupon.value = false;
  }
};


const handleCheckout = async () => {
  if (!book.value) return;
  
  isCheckingOut.value = true;
  error.value = null;
  
  try {
    const { orderId, checkoutUrl, isFree } = await processPayment(
      [book.value.id],  
      couponCode.value 
    );
    
    if (isFree) {
      router.push(`/payment/success?order_id=${orderId}&free=true`);
    } else {
      window.location.href = checkoutUrl;
    }
    
  } catch (err) {
    error.value = err.message || 'فشل معالجة الطلب';
    console.error('Checkout error:', err);
  } finally {
    isCheckingOut.value = false;
  }
};
</script>