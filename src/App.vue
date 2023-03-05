<script setup lang="ts">
import ZoomThingy from './components/ZoomThingy.vue';
</script>

<template>
  <p>Draggable (when zoomed in), ctrl + scroll to zoom in/out</p>
  <ZoomThingy />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
