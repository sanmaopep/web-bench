<template>
  <div class="layout">
    <header class="site-header">
      <NuxtLink to="/" class="site-title">🛍️ WebBench Shopping Mart</NuxtLink>
      <HeaderUserMenu />
    </header>
    <main class="main-content">
      <slot />
    </main>
    <footer class="site-footer">
      <p>Copyright: Web Bench</p>
    </footer>
    <Cart />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.site-title {
  cursor: pointer;
  transition: color 0.3s;
  text-decoration: none;
  color: inherit;
  display: inline-block;
}

.site-title:hover {
  color: #3498db;
}

.main-content {
  margin-top: 70px;
  margin-bottom: 60px;
  flex: 1;
  padding: 1rem;
}

.site-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #f8f8f8;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}
</style>
