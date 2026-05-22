import { defineStore } from 'pinia'
import { ref } from 'vue'
import { processPayment, ValidateCoupon } from '../api/PaymentService.js'

export const usePaymentStore = defineStore('payment', () => {
  const loading = ref(false)
  const error = ref(null)
  const couponValid = ref(false)
  const couponDiscountPercent = ref(0)
  const couponCode = ref('')
  const couponError = ref(null)
  const couponSuccess = ref(null)

  // Reset coupon state
  const resetCoupon = () => {
    couponValid.value = false
    couponDiscountPercent.value = 0
    couponCode.value = ''
    couponError.value = null
    couponSuccess.value = null
  }

  // Validate and apply coupon
  const applyCoupon = async (code) => {
    loading.value = true
    couponError.value = null
    couponSuccess.value = null
    
    try {
      const response = await ValidateCoupon(code)
      
      if (response.valid) {
        couponValid.value = true
        couponDiscountPercent.value = response.discountPercentage || 0
        couponCode.value = code
        couponSuccess.value = `تم تطبيق كود الخصم بنجاح! خصم ${couponDiscountPercent.value}%`
      } else {
        throw new Error(response.message || 'كود الخصم غير صحيح')
      }
    } catch (err) {
      couponValid.value = false
      couponDiscountPercent.value = 0
      couponError.value = err.message || 'فشل التحقق من كود الخصم'
      console.error('Coupon validation error:', err)
    } finally {
      loading.value = false
    }
  }

  // Process payment
  const checkout = async (bookIds) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await processPayment(
        bookIds, 
        couponValid.value ? couponCode.value : null
      )
      
      return response // Contains order data, payment URL, etc.
    } catch (err) {
      error.value = err.message
      console.error('Payment error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    loading,
    error,
    couponValid,
    couponDiscountPercent,
    couponCode,
    couponError,
    couponSuccess,
    
    // Actions
    applyCoupon,
    checkout,
    resetCoupon
  }
})
