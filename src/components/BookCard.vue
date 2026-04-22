
<template>
  <div class="bg-white rounded-lg overflow-hidden shadow-lg ring-4 ring-green-300 ring-opacity-40 max-w-sm cursor-pointer hover:shadow-xl transition-shadow" @click="GoToDetails(book.id)">
    <div class="relative">
      <img 
        class="w-full h-48 object-cover width-fit" 
        :src="'https://www.svgrepo.com/show/492785/book-and-person-summer.svg' || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'" 
        :alt="book.name"
      >
   
      <div v-if="book.price < 20" class="absolute top-0 right-0 bg-green-300 text-white px-2 py-1 m-2 rounded-md text-sm font-medium">
        SALE
      </div>
    </div>
    <div class="p-4">
      <h3 class="text-lg font-medium mb-2 truncate">{{ book.name }}</h3>
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">
        {{ book.description }}
      </p>
      <div class="flex items-center justify-between">
        <span class="font-bold text-lg">${{ Number(book.price).toFixed(2) }}</span>
        <button 
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
          @click.stop="GoToDetails(book.id)"
        >
          Buy Now
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()


const props = defineProps({
  book: {
    type: Object,
    required: true,
   
    validator: (value) => {
      return value && typeof value.id === 'string' && typeof value.name === 'string'
    }
  }
})

// Runtime emits declaration
const emit = defineEmits(['view-details'])


const GoToDetails = (id) => {
  
  emit('view-details', id)
  
  router.push(`/books/${id}`)
}
</script>