import { defineStore } from "pinia";
import {ref} from "vue"
import {api} from "../api/UserService.js"

export const SearchStore = defineStore("search",()=>{
const searchQuery = ref("");
const results = ref({ users: [], books: [] });
const isLoading = ref(false);
const performSearch = async () => {
  if (searchQuery.value.trim().length < 2) {
    results.value = { users: [], books: [] };
    return;
  }

  isLoading.value = true;
  try {
    const response = await api.post("/user/GetSearchResults", {
      content: searchQuery.value 
    });
    
    // الباك-إند يرسل النتيجة داخل Result.Value
    if (response.data) {
      results.value = response.data;
    }
  } catch (error) {
    console.error("Search error:", error);
  } finally {
    isLoading.value = false;
  }
};
return { searchQuery, results, isLoading, performSearch };
})