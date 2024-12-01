import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/main.css'

import { createApp } from 'vue'
import Layout from './components/Layout.vue'
import router from './router'

createApp(Layout).use(router).mount('#app')
