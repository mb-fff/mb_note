import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/reset.css'
import './assets/css/login.min.css'
import 'element-plus/dist/index.css'
import VMdEditor from './utils/markdown'

const app = createApp(App)

app.use(store).use(router).use(VMdEditor).mount('#app')
