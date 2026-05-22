// 📁 src/api/BookService.js
import axios from "axios";
import { GENRES } from '../constants/genres.js';

const api = axios.create({
  baseURL: "https://ybrbookstoreapi.runasp.net/api/", 
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  timeout: 8000,
  withCredentials: true,  
});

export const getBooks = async () => {
  console.log("Fetching books...");
  try {
    const response = await api.get("/books");
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

export const getBookById = async (id) => {
  console.log(`Fetching book with id: ${id}`);
  try {
    const response = await api.get(`/books/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching book with id ${id}:`, error);
    throw error;
  }
};

export const addBook = async (bookData) => {
  console.log('📤 addBook called with:', {
    baseURL: api.defaults.baseURL,
    endpoint: "Vendor/sellbook",
    payload: bookData
  });

  if (!bookData.Name || !bookData.Author || bookData.Price == null) {
    throw new Error("Missing required fields: Name, Author, or Price");
  }

  try {
    let genreIndices = [];
    
    if (bookData.Genres && Array.isArray(bookData.Genres)) {
      genreIndices = bookData.Genres
        .map(function(g) {
          if (typeof g === 'string') {
            return GENRES.indexOf(g);
          }
          return g;
        })
        .filter(function(idx) {
          return typeof idx === 'number' && idx >= 0;
        });
    }

    // ✅ Build the final payload
    const payload = {
      Name: bookData.Name,
      Description: bookData.Description,
      Author: bookData.Author,
      Price: bookData.Price,
      Isbn: bookData.Isbn,
      ImageUrl: bookData.ImageUrl,
      Genres: genreIndices  
    };

    console.log('📤 Final payload to backend:', payload);
    
    const response = await api.post("Vendor/sellbook", payload);
    
    console.log('✅ Book added successfully:', response.data);
    return response.data;
    
  } catch (error) {
    console.error(' addBook failed:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });
    throw error;
  }
};

export { api };