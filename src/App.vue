<script setup lang='ts'>
import Canvas from './components/canvas/Canvas.vue'
import Footer from './components/nav/Footer.vue'
import Navigation from './components/nav/Navigation.vue'
</script>

<template>
  <div class="app">
    <Navigation />
    <main>
      <Canvas />
    </main>
    <Footer />
  </div>
</template>
