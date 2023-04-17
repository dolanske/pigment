import { createApp } from 'vue'
import './style/index.scss'
import { createPinia } from 'pinia'
import App from './App.vue'

/**
 * This is the main application entry point.
 * You can import and register global component
 * or install plugins into the vue instance.
 */

const app = createApp(App)

app.use(createPinia())

// Finally, append the entire app the the <div id="app" />
app.mount('#app')
