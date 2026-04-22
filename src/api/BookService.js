// src/api/books.js
import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:5161/api",
  headers: { "Content-Type": "application/json" },
  timeout: 8000,
  withCredentials: false,
});

/**
 * Fetch all books
 * @returns {Promise<Array>} - Array of book objects
 */
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

/**
 * Fetch a single book by ID
 * @param {string} id - The book ID
 * @returns {Promise<Object>} - Book object
 */
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

