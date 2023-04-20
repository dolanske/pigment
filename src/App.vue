<script setup lang='ts'>
import Canvas from './components/canvas/Canvas.vue'
import Navigation from './components/nav/Navigation.vue'
import Sidebar from './components/nav/Sidebar.vue'
</script>

<template>
  <div class="app">
    <Navigation />
    <main>
      <Sidebar />
      <Canvas />
    </main>
    <!-- <Footer /> -->
  </div>
</template>
