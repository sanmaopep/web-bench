<template>
  <div class="home-container">
    <h1 v-if="user">Hello {{ user.username }}!</h1>
    <h1 v-else>🛍️🛍️🛍️ Welcome to Shopping Mart !</h1>
    <div class="navigation-buttons">
      <NuxtLink to="/products" class="home-go-products-link">Browse Products</NuxtLink>
      <NuxtLink v-if="user" to="/wishlist" class="home-go-wish-list">My Wishlist</NuxtLink>
      
      <template v-if="user && user.role === 'admin'">
        <div class="admin-links">
          <h2>Admin Portal</h2>
          <div class="admin-buttons">
            <NuxtLink to="/admin/products" class="home-go-product-portal-link">
              Product Management
            </NuxtLink>
            <NuxtLink to="/admin/users" class="home-go-user-portal-link">
              User Management
            </NuxtLink>
            <NuxtLink to="/admin/orders" class="home-go-order-portal-link">
              Order Management
            </NuxtLink>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useUser } from '~/composables/useUser'

const { user } = useUser()
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.navigation-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 800px;
}

.home-go-products-link,
.home-go-wish-list {
  display: inline-block;
  background-color: #3498db;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  text-decoration: none;
  text-align: center;
  width: 100%;
  max-width: 300px;
}

.home-go-products-link:hover {
  background-color: #2980b9;
}

.home-go-wish-list {
  background-color: #f39c12;
}

.home-go-wish-list:hover {
  background-color: #e67e22;
}

.admin-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.admin-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  width: 100%;
}

.home-go-product-portal-link,
.home-go-user-portal-link,
.home-go-order-portal-link {
  background-color: #27ae60;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 200px;
}

.home-go-user-portal-link {
  background-color: #9b59b6;
}

.home-go-order-portal-link {
  background-color: #e74c3c;
}

.home-go-product-portal-link:hover {
  background-color: #219653;
  transform: translateY(-2px);
}

.home-go-user-portal-link:hover {
  background-color: #8e44ad;
  transform: translateY(-2px);
}

.home-go-order-portal-link:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}
</style>