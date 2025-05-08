<template>
  <div class="admin-panel">
    <h1>Admin Portal - Users Management</h1>
    
    <div v-if="isLoading" class="loading">Loading users...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="admin-table-container">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Coins</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.username" :id="`admin_user_${user.username}`">
            <td>{{ user.username }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.coin }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useUser } from '~/composables/useUser'

const { user } = useUser()
const router = useRouter()

// Redirect if not admin
onMounted(async () => {
  await refreshNuxtData()
  if (!user.value || user.value.role !== 'admin') {
    router.push('/login')
  }
})

const { data, error, pending } = await useFetch('/api/admin/users')
const users = computed(() => data.value?.users || [])
const isLoading = computed(() => pending.value)
</script>

<style scoped>
.admin-panel {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.admin-table-container {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.admin-table th,
.admin-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.admin-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #2c3e50;
}

.admin-table tr:hover {
  background-color: #f5f5f5;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}
</style>