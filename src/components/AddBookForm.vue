<script setup>
// ✅ 1. أضفنا استيراد onMounted هنا
import { ref, onMounted } from 'vue' 
import { useRouter } from 'vue-router'
import GenresList from './GenresList.vue'
import { addBook } from '../api/BookService.js'
import { GENRES } from '../constants/genres.js'

const name = ref('')
const description = ref('')
const author = ref('')
const isbn = ref('')
const imageUrl = ref('')
const price = ref(0)
const genresList = ref(null)  
const router = useRouter()   

const handleSubmit = async () => {
  try {
    const genreIndices = genresList.value?.selectedGenres ?? [];
    
    console.log('🎯 Genres from child:', {
      raw: genreIndices,
      count: genreIndices.length,
      types: genreIndices.map(g => typeof g)
    });
    
    if (genreIndices.length === 0) {
      alert("يرجى اختيار نوع واحد على الأقل للكتاب");
      return; 
    }
    
    const priceValue = Number(price.value);
    if (isNaN(priceValue) || priceValue <= 0) {
      throw new Error("السعر يجب أن يكون رقماً أكبر من الصفر");
    }
    
    const formData = {
      Name: name.value?.trim(),
      Description: description.value?.trim(),
      Author: author.value?.trim(),
      Isbn: isbn.value?.trim(),
      ImageUrl: imageUrl.value?.trim() || "https://via.placeholder.com/300x450?text=No+Image",
      Price: priceValue,
      Genres: genreIndices 
    };
    
    console.log('📤 Sending to API:', JSON.stringify(formData, null, 2));
    
    await addBook(formData);
    router.replace("/userpage");
    
  } catch (error) {
    const backendError = error.response?.data?.error || error.message;
    console.error('❌ Submission failed:', backendError);
    alert("حدث خطأ: " + backendError);
  }
};

onMounted(() => {
  console.log('🔍 GenresList ref on mount:', {
    genresList_value: genresList.value,
    has_selectedGenres: genresList.value?.selectedGenres !== undefined,
    selectedGenres_value: genresList.value?.selectedGenres
  });
});
</script>

<template>
  <form @submit.prevent="handleSubmit" class="max-w-sm mx-auto space-y-4">
    <div>
      <label for="name" class="block mb-2.5 text-sm font-medium">NAME</label>
      <input id="name" type="text" v-model="name" class="w-full px-3 py-2 border rounded" required />
    </div>
    
    <div>
      <label for="description" class="block mb-2.5 text-sm font-medium">DESCRIPTION</label>
      <input id="description" type="text" v-model="description" class="w-full px-3 py-2 border rounded" required />
    </div>
    
    <div>
      <label for="author" class="block mb-2.5 text-sm font-medium">AUTHOR</label>
      <input id="author" type="text" v-model="author" class="w-full px-3 py-2 border rounded" required />
    </div>
    
    <div>
      <label for="isbn" class="block mb-2.5 text-sm font-medium">ISBN</label>
      <input id="isbn" type="text" v-model="isbn" class="w-full px-3 py-2 border rounded" required />
    </div>
    
    <div>
      <label for="price" class="block mb-2.5 text-sm font-medium">PRICE</label>
      <input id="price" type="number" step="0.01" v-model="price" class="w-full px-3 py-2 border rounded" required />
    </div>
    
    <div>
      <label for="imageUrl" class="block mb-2.5 text-sm font-medium">IMAGE URL</label>
      <input id="imageUrl" type="url" v-model="imageUrl" class="w-full px-3 py-2 border rounded" placeholder="https://example.com/image.jpg" />
    </div>

    <div>
      <label class="block mb-2.5 text-sm font-medium">GENRES</label>
      <GenresList ref="genresList" />
    </div>

    <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors">
      Add Book
    </button>
  </form>
 
</template>