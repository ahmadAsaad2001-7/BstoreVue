<!-- 📁 src/components/CartItemsList.vue -->
<template>
  <!-- Loading State -->
  <div v-if="cartStore.isLoading" class="py-8 text-center text-slate-400">
    Loading your cart...
  </div>

  <!-- Error State -->
  <div v-else-if="cartStore.error" class="py-8 text-center text-red-400">
    ❌ {{ cartStore.error }}
    <button @click="cartStore.getCart()" class="ml-2 underline">Retry</button>
  </div>

  <!-- Empty Cart -->
  <div v-else-if="cartItems.length === 0" class="py-8 text-center text-slate-400">
    🛒 Your cart is empty
  </div>

  <!-- Items List -->
  <template v-else>
    <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-4 py-4 border-b border-white/10">
      
      <!-- ✅ Fixed: Use correct field names from backend -->
      <img 
        :src="item.bookCoverUrl || '/fallback-book.png'" 
        :alt="item.bookName" 
        class="w-16 h-20 object-cover rounded"
        @error="(e) => e.target.src = 'https://via.placeholder.com/100x150?text=No+Image'"
      />
      
      <div class="flex-1 min-w-0">
        <!-- ✅ Fixed: bookName not title -->
        <h3 class="text-sm font-medium text-white truncate">{{ item.bookName }}</h3>
        <p class="text-xs text-slate-500">Qty: {{ item.quantity }}</p>
      </div>
      
      <!-- ✅ Fixed: unitPrice not price, and use pre-calculated totalPrice -->
      <p class="text-sm font-semibold text-emerald-400">
        ${{ item.totalPrice?.toFixed(2) || (item.unitPrice * item.quantity).toFixed(2) }}
      </p>
      
      <!-- Optional: Remove button -->
      <button 
        @click="handleRemove(item.id)"
        class="text-slate-500 hover:text-red-400 text-sm"
        title="Remove"
      >
        ✕
      </button>
    </div>
  </template>
</template>

<script setup>
import { computed } from 'vue'  // ✅ Fixed: Import computed, not ref
import { useCartStore } from '../stores/cartStore.js'

const cartStore = useCartStore()

// ✅ Fixed: Use computed for reactive binding to Pinia store
// This ensures UI updates when cart changes anywhere in the app
const cartItems = computed(() => cartStore.cartItems)

// ✅ Optional: Load cart on mount if not already loaded
if (cartStore.cartItems.length === 0 && !cartStore.isLoading) {
  cartStore.getCart()
}

// ✅ Handle remove with confirmation
const handleRemove = async (itemId) => {
  if (confirm('Remove this item from your cart?')) {
    await cartStore.removeFromCart(itemId)
  }
}
</script>