// 📁 src/api/CartService.js
import api from './axios'

/**
 * Add item to cart
 * @param {string} bookId - The book ID (GUID) to add
 * @param {number} quantity - Quantity to add (default: 1, max: 99)
 * @returns {Promise<Object>} 
 *   { cartItemId: string, bookName: string, quantity: number, unitPrice: number, totalPrice: number }
 */
export const addToCart = async (bookId, quantity = 1) => {
  try {
    const response = await api.post('/cart/add', {
      bookId,
      quantity
    })
    return response.data
  } catch (error) {
    // 🎯 Extract meaningful error message from backend
    const errorMessage = error.response?.data?.error || error.message || 'Failed to add to cart'
    
    console.error('❌ Add to cart failed:', {
      status: error.response?.status,
      error: errorMessage,
      bookId,
      quantity
    })
    
    // Re-throw with cleaned error for UI
    const err = new Error(errorMessage)
    err.status = error.response?.status
    err.code = error.response?.data?.error
    throw err
  }
}

/**
 * Get user's cart
 * @returns {Promise<Array>} Array of CartItemResponse objects
 *   [{ id, bookId, bookName, bookCoverUrl, unitPrice, quantity, totalPrice, addedAt }]
 */
export const getCart = async () => {
  try {
    const response = await api.get('/cart')
    // ✅ Backend returns array directly, not wrapped in { cartItems: [...] }
    return response.data
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch cart'
    
    console.error('❌ Get cart failed:', {
      status: error.response?.status,
      error: errorMessage
    })
    
    const err = new Error(errorMessage)
    err.status = error.response?.status
    throw err
  }
}

/**
 * Update cart item quantity
 * @param {string} itemId - The cart item ID (GUID) to update
 * @param {number} quantity - New quantity (1-99)
 * @returns {Promise<Object>} Updated item: { cartItemId, bookName, quantity, unitPrice, totalPrice }
 */
export const updateCartItemQuantity = async (itemId, quantity) => {
  try {
    // ⚠️ Body must include cartItemId matching the route param
    const response = await api.put(`/cart/items/${itemId}`, {
      cartItemId: itemId, // Required by backend validation
      quantity
    })
    return response.data
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Failed to update quantity'
    
    console.error('❌ Update quantity failed:', {
      status: error.response?.status,
      error: errorMessage,
      itemId,
      quantity
    })
    
    const err = new Error(errorMessage)
    err.status = error.response?.status
    throw err
  }
}

/**
 * Remove item from cart
 * @param {string} itemId - The cart item ID (GUID) to remove
 * @returns {Promise<null>} Resolves on success (204 No Content)
 */
export const removeFromCart = async (itemId) => {
  try {
    await api.delete(`/cart/items/${itemId}`)
    // ✅ 204 No Content has no body - return null explicitly
    return null
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Failed to remove item'
    
    console.error('❌ Remove from cart failed:', {
      status: error.response?.status,
      error: errorMessage,
      itemId
    })
    
    const err = new Error(errorMessage)
    err.status = error.response?.status
    throw err
  }
}

export { api }