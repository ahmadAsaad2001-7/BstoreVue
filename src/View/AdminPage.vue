<template>
  <div class="min-h-screen bg-brand-bg text-brand-text">
    <NavBar />

    <div class="max-w-screen-xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
      <!-- Admin Sidebar -->
      <aside class="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
        <h2 class="text-xl font-bold mb-6">Admin Panel</h2>
        <ul class="flex flex-col gap-3 font-medium text-sm">
          <li>
            <button 
              @click="activeTab = 'votes'" 
              class="text-left w-full hover:opacity-70 transition-opacity"
              :class="{ 'underline decoration-2 underline-offset-4 font-bold': activeTab === 'votes' }"
            >
              Votes & Requests
            </button>
          </li>
          <li>
            <button 
              @click="activeTab = 'coupons'" 
              class="text-left w-full hover:opacity-70 transition-opacity"
              :class="{ 'underline decoration-2 underline-offset-4 font-bold': activeTab === 'coupons' }"
            >
              Manage Coupons
            </button>
          </li>
          <li>
            <button 
              @click="activeTab = 'users'" 
              class="text-left w-full hover:opacity-70 transition-opacity"
              :class="{ 'underline decoration-2 underline-offset-4 font-bold': activeTab === 'users' }"
            >
              Users Directory
            </button>
          </li>
        </ul>
      </aside>

      <!-- Main Content -->
      <main class="w-full md:w-3/4 lg:w-4/5">
        
        <!-- Votes Tab -->
        <div v-if="activeTab === 'votes'" class="space-y-6">
          <h3 class="text-2xl font-bold border-b border-gray-300 pb-4">Pending Requests</h3>
          <div v-if="loading" class="opacity-70">Loading votes...</div>
          <div v-else-if="votes.length === 0" class="p-6 border border-gray-300 text-center text-sm">No pending requests.</div>
          <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VoteCard 
              v-for="vote in votes" 
              :key="vote.id" 
              :vote="vote" 
              @vote="handleVote"
            />
          </div>
        </div>

        <!-- Coupons Tab -->
        <div v-if="activeTab === 'coupons'" class="space-y-8">
          <div>
            <h3 class="text-2xl font-bold border-b border-gray-300 pb-4 mb-6">Create New Coupon</h3>
            <form @submit.prevent="handleCreateCoupon" class="max-w-md space-y-4">
              <div>
                <label class="block text-sm font-semibold mb-2">Coupon Code</label>
                <input v-model="newCoupon.code" type="text" class="w-full px-4 py-2 bg-transparent border border-gray-400 focus:outline-none focus:border-brand-text" required>
              </div>
              <div class="flex gap-4">
                <div class="flex-1">
                  <label class="block text-sm font-semibold mb-2">Discount (%)</label>
                  <input v-model.number="newCoupon.Discount_percentage" type="number" min="1" max="100" class="w-full px-4 py-2 bg-transparent border border-gray-400 focus:outline-none focus:border-brand-text" required>
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-semibold mb-2">Quantity</label>
                  <input v-model.number="newCoupon.quantity" type="number" min="1" class="w-full px-4 py-2 bg-transparent border border-gray-400 focus:outline-none focus:border-brand-text" required>
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Expiry Date</label>
                <input v-model="newCoupon.expiryDate" type="datetime-local" class="w-full px-4 py-2 bg-transparent border border-gray-400 focus:outline-none focus:border-brand-text" required>
              </div>
              <button type="submit" class="px-6 py-2 bg-brand-text text-brand-bg rounded-full text-sm font-bold hover:opacity-80 transition-opacity">
                Create Coupon
              </button>
              <p v-if="couponMsg" class="text-sm font-medium mt-2">{{ couponMsg }}</p>
            </form>
          </div>
        </div>

        <!-- Users Tab -->
        <div v-if="activeTab === 'users'" class="space-y-6">
          <h3 class="text-2xl font-bold border-b border-gray-300 pb-4">User Directory</h3>
          <div v-if="loading" class="opacity-70">Loading users...</div>
          <div v-else-if="users.length === 0" class="p-6 border border-gray-300 text-center text-sm">No users found.</div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <UserCard v-for="user in users" :key="user.id || user.userId" :user="user" />
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import NavBar from '../components/NavBar.vue'
import VoteCard from '../components/VoteCard.vue'
import UserCard from '../components/UserCard.vue'
import { fetchAdminVotes, castAdminVote } from '../api/VotesServices.js'
import { GetAllUsers, AddCoupon } from '../api/AdminService.js'

const activeTab = ref('votes')
const loading = ref(false)
const votes = ref([])
const users = ref([])

// Coupon Form State
const newCoupon = reactive({
  code: '',
  quantity: 1,
  expiryDate: '',
  Discount_percentage: 10
})
const couponMsg = ref('')

const loadData = async () => {
  loading.value = true
  try {
    const fetchedVotes = await fetchAdminVotes()
    votes.value = Array.isArray(fetchedVotes.value || fetchedVotes) ? (fetchedVotes.value || fetchedVotes) : []
    
    const fetchedUsers = await GetAllUsers()
    users.value = fetchedUsers || []
  } catch (err) {
    console.error("Error loading admin data:", err)
  } finally {
    loading.value = false
  }
}

const handleVote = async ({ id, isApproved }) => {
  try {
    await castAdminVote(id, isApproved)
    await loadData()
  } catch (err) {
    console.error("Vote failed:", err)
    alert("Failed to cast vote.")
  }
}

const handleCreateCoupon = async () => {
  couponMsg.value = 'Creating...'
  try {
    await AddCoupon({ ...newCoupon })
    couponMsg.value = 'Coupon created successfully!'
    newCoupon.code = ''
    newCoupon.quantity = 1
    newCoupon.expiryDate = ''
    newCoupon.Discount_percentage = 10
  } catch (err) {
    console.error(err)
    couponMsg.value = 'Failed to create coupon.'
  }
}

onMounted(() => {
  loadData()
})
</script>