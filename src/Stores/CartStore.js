// 📁 src/stores/CartStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as CartService from '../api/CartService'

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref([]) // Array of CartItemResponse
  const isLoading = ref(false)
  const error = ref(null)

  // ✅ Computed: Total price of all items
  const totalPrice = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
  })

  // ✅ Computed: Total quantity of all items
  const totalItems = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (item.quantity || 0), 0)
  })

  // ✅ Computed: Check if specific book is in cart
  const isBookInCart = (bookId) => {
    return computed(() => cartItems.value.some(item => item.bookId === bookId))
  }

  // 🛒 Add item to cart via API
  const addToCart = async (bookId, quantity = 1) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await CartService.addToCart(bookId, quantity)
      
      // ✅ Backend returns: { cartItemId, bookName, quantity, unitPrice, totalPrice }
      // Map to local state format (using 'id' not 'cartItemId' for consistency)
      const newItem = {
        id: response.cartItemId,      // ✅ Backend field: cartItemId → local: id
        bookId: bookId,
        bookName: response.bookName,
        unitPrice: response.unitPrice,
        quantity: response.quantity,
        totalPrice: response.totalPrice,
        addedAt: new Date().toISOString() // Local fallback if not provided
      }

      // Update local state: check if item already exists
      const existingIndex = cartItems.value.findIndex(item => item.id === newItem.id)
      
      if (existingIndex !== -1) {
        // Update existing item
        cartItems.value[existingIndex] = { ...cartItems.value[existingIndex], ...newItem }
      } else {
        // Add new item
        cartItems.value.push(newItem)
      }

      return response
    } catch (err) {
      error.value = err.message || 'Failed to add to cart'
      console.error('❌ CartStore addToCart error:', error.value)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 📦 Fetch cart from API
  const getCart = async () => {
    isLoading.value = true
    error.value = null

    try {
      // ✅ Backend returns array directly: CartItemResponse[]
      const items = await CartService.getCart()
      
      // Map backend fields to consistent local format if needed
      cartItems.value = items.map(item => ({
        id: item.id,                    // ✅ Backend: id (CartItemResponse.Id)
        bookId: item.bookId,
        bookName: item.bookName,
        bookCoverUrl: item.bookCoverUrl,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        addedAt: item.addedAt
      }))
      
      return cartItems.value
    } catch (err) {
      error.value = err.message || 'Failed to fetch cart'
      console.error('❌ CartStore getCart error:', error.value)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ✏️ Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await CartService.updateCartItemQuantity(itemId, quantity)
      
      // ✅ Update local state with response: { cartItemId, bookName, quantity, unitPrice, totalPrice }
      const index = cartItems.value.findIndex(item => item.id === itemId)
      if (index !== -1 && response) {
        cartItems.value[index] = {
          ...cartItems.value[index],
          quantity: response.quantity,
          totalPrice: response.totalPrice
        }
      }
      
      return response
    } catch (err) {
      error.value = err.message || 'Failed to update quantity'
      console.error('❌ CartStore updateQuantity error:', error.value)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 🗑️ Remove item from cart
  const removeFromCart = async (itemId) => {
    isLoading.value = true
    error.value = null

    try {
      await CartService.removeFromCart(itemId)
      // ✅ Remove from local state
      cartItems.value = cartItems.value.filter(item => item.id !== itemId)
    } catch (err) {
      error.value = err.message || 'Failed to remove item'
      console.error('❌ CartStore removeFromCart error:', error.value)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 🧹 Clear local cart state (e.g., after checkout)
  const clearCart = () => {
    cartItems.value = []
    error.value = null
  }

  // 🔁 Refresh cart from API
  const refreshCart = async () => {
    return await getCart()
  }

  return {
    // State
    cartItems,
    isLoading,
    error,
    
    // Computed
    totalPrice,
    totalItems,
    isBookInCart,
    
    // Actions
    addToCart,
    getCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart
  }
})