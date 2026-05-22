<!-- 📁 components/BookCard.vue -->
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  book: {
    type: Object,
    required: true,
    validator: (value) => value && typeof value.id === 'string'
  }
})

const viewBook = () => {
  router.push(`/books/${props.book.id}`);
};

const handleBuyNow = (bookId) => {
  router.push({
    path: '/checkout',
    query: { bookId }
  })
}
</script>

<template>
  <div
    @click="viewBook"
    class="group cursor-pointer flex flex-col bg-slate-900 border border-white/8 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 hover:border-emerald-500/30"
  >
    <!-- Image Container -->
    <div class="relative w-full aspect-[3/4] overflow-hidden bg-slate-800 flex items-center justify-center p-4">
      <!-- Sale badge -->
      <div v-if="book.price < 20" class="absolute top-3 left-3 z-10 text-[10px] font-extrabold uppercase tracking-widest text-white bg-orange-500 rounded-md px-2 py-1 shadow-md">
        Sale
      </div>

      <img
        :src="book.coverUrl || book.imageUrl || '/fallback-book.png'"
        :alt="book.title"
        class="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
        @error="(e) => e.target.src = 'https://via.placeholder.com/300x400?text=No+Cover'"
      />

      <!-- Hover overlay with quick action -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
        <span class="text-xs font-semibold text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          عرض الكتاب
        </span>
      </div>
    </div>

    <!-- Book Details -->
    <div class="p-4 flex flex-col gap-1">
      <h3 class="font-bold text-sm text-white leading-snug line-clamp-2">
        {{ book.title || book.name }}
      </h3>
      <p class="text-emerald-400 font-semibold text-sm mt-1">
        ${{ Number(book.price).toFixed(2) }}
      </p>
    </div>
  </div>
</template>
