// 📁 src/api/PaymentService.js
import axios from "axios";

const api = axios.create({
  baseURL: " http://yellowblueredbookstoreapi.runasp.net/api",
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  timeout: 8000,
  withCredentials: true, 
});

export const processPayment = async (bookIds, couponCode = null) => {
  console.log(`Processing payment for ${bookIds.length} book(s)...`);
  
  try {
    const response = await api.post("/orders/checkout", {
      bookIds,  
      couponCode: couponCode?.trim() || null 
    });
    


    return response.data;
    
  } catch (error) {
    console.error(`Payment processing failed:`, error);
    
    const errorMessage = error.response?.data?.error 
      || error.response?.data 
      || error.message;
      
    throw new Error(errorMessage);
  }
};
export const ValidateCoupon = async (code) => {
  try {
    const response = await api.post(`/user/coupons/validate`, {
       code: code.trim() 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "كود الخصم غير صحيح";
  }
};

export { api };