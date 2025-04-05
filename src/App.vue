<template>
  <div class="app">
    <NavigationBar />
    <router-view />
  </div>
</template>

<script setup>
import NavigationBar from './components/NavigationBar.vue';
</script>

<style>
body {
  font-family: Arial, sans-serif;
}
</style>