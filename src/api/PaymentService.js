// 📁 src/api/PaymentService.js
import axios from "axios";

// ✅ Create axios instance WITH cookie support
const api = axios.create({
  baseURL: "http://localhost:5161/api",
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
    
    // ✅ The API returns the checkout object directly, so we just return response.data
    // If the API returns a 400 or 500 error, Axios will automatically throw it to the catch block
    return response.data;
    
  } catch (error) {
    console.error(`Payment processing failed:`, error);
    
    // Attempt to extract the C# error message if it exists
    const errorMessage = error.response?.data?.error 
      || error.response?.data 
      || error.message;
      
    throw new Error(errorMessage);
  }
};


export { api };