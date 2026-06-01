import axios from "axios";

// 1. Create Axios Instance
const api = axios.create({
  baseURL: "https://ybrbookstoreapi.runasp.net/api",
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  timeout: 8000,
  withCredentials: true, 
});

// 2. API Functions
export const addToCart = async (bookId, quantity = 1) => {
  try {
    const response = await api.post('/cart/add', { bookId, quantity });
    return response.data;
  } catch (error) {
    console.error("Failed to add to cart:", error.response?.data || error.message);
    throw error;
  }
};

export const updateQuantity = async (itemId, quantity) => {
  try {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error("Failed to update quantity:", error.response?.data || error.message);
    throw error;
  }
};

export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch cart items:", error.response?.data || error.message);
    throw error;
  }   
};