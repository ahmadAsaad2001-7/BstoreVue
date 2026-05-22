<template>
  <div class="min-h-screen bg-brand-bg p-4 md:p-8" dir="rtl">
    
    <button 
      @click="router.back()" 
      class="mb-6 flex items-center gap-2 text-gray-500 hover:text-brand-text transition-colors font-bold"
    >
      <span>←</span>
      <span>العودة</span>
    </button>

    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-5xl font-extrabold text-brand-text mb-2">تأكيد الطلب</h1>
        <p class="text-gray-500 font-medium">راجع تفاصيل طلبك قبل المتابعة</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white p-8 border border-gray-300 text-center opacity-70 font-bold">
        جاري تحميل تفاصيل الكتاب...
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-500 p-6 text-center font-bold text-red-700">
        <p class="mb-4">⚠️ {{ error }}</p>
        <button @click="router.back()" class="px-6 py-2 bg-red-700 text-white rounded-full">
          العودة
        </button>
      </div>

      <!-- Order Summary -->
      <div v-else-if="book" class="space-y-6">
        
        <!-- Book Card -->
        <div class="bg-white p-6 border border-gray-300">
          <div class="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <img 
              :src="book.imageUrl || 'https://www.svgrepo.com/show/492785/book-and-person-summer.svg'" 
              :alt="book.name"
              class="w-32 h-40 object-contain"
            >
            <div class="flex-1 text-center sm:text-right">
              <h2 class="text-2xl font-black text-brand-text mb-2">{{ book.name }}</h2>
              <p class="text-gray-500 font-bold mb-4">{{ book.author }}</p>
              <div class="flex items-center justify-center sm:justify-start gap-2">
                <span class="text-3xl font-black text-brand-text">${{ Number(book.price).toFixed(2) }}</span>
                <span v-if="couponDiscountPercent > 0" class="text-sm text-green-600 font-bold bg-green-100 px-2 py-1">
                  (وفر ${{ (book.price * couponDiscountPercent / 100).toFixed(2) }})
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Coupon Code Input -->
        <div class="bg-white p-6 border border-gray-300">
          <label class="block text-brand-text font-bold mb-3">كود الخصم (اختياري)</label>
          <div class="flex gap-2">
            <input 
              v-model="couponCode"
              type="text"
              placeholder="أدخل كود الخصم"
              class="flex-1 px-4 py-3 bg-transparent border border-gray-300 text-brand-text placeholder-gray-400 focus:outline-none focus:border-brand-text focus:ring-1 focus:ring-brand-text transition-colors"
              @keyup.enter="applyCoupon"
            >
            <button 
              @click="applyCoupon"
              :disabled="applyingCoupon"
              class="px-6 py-3 bg-brand-text hover:bg-gray-800 disabled:opacity-50 text-white font-bold transition-colors"
            >
              {{ applyingCoupon ? 'جاري...' : 'تطبيق' }}
            </button>
          </div>
          <p v-if="couponError" class="text-red-600 font-bold text-sm mt-3">{{ couponError }}</p>
          <p v-if="couponSuccess" class="text-green-600 font-bold text-sm mt-3">{{ couponSuccess }}</p>
        </div>

        <!-- Order Total -->
        <div class="bg-white p-6 border border-gray-300">
          <div class="flex justify-between text-gray-500 font-bold mb-3">
            <span>السعر الأصلي:</span>
            <span>${{ Number(book.price).toFixed(2) }}</span>
          </div>
          <div v-if="couponDiscountPercent > 0" class="flex justify-between text-green-600 font-bold mb-3">
            <span>الخصم:</span>
            <span>-${{ (book.price * couponDiscountPercent / 100).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-brand-text font-black text-xl pt-4 border-t border-gray-300">
            <span>الإجمالي:</span>
            <span>${{ finalPrice.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Confirm Button -->
        <button 
          @click="handleCheckout"
          :disabled="isCheckingOut"
          class="w-full py-4 px-6 bg-brand-accent hover:opacity-90 disabled:opacity-50 text-brand-text font-black text-xl rounded-full transition-all flex items-center justify-center gap-2 border border-brand-text shadow-sm"
        >
          <span v-if="isCheckingOut" class="w-5 h-5 border-2 border-brand-text/30 border-t-brand-text rounded-full animate-spin"></span>
          {{ isCheckingOut ? 'جاري معالجة الطلب...' : 'تأكيد ودفع' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getBookById } from '../api/BookService.js';
import { processPayment, ValidateCoupon } from '../api/PaymentService.js';

const route = useRoute();
const router = useRouter();

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
      couponData.discountPercentage 
      || couponData.Discount_percentage 
      || couponData.discount_percentage 
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