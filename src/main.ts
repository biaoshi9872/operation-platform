import { createApp } from 'vue'
import App from './App.vue'
import elementPlus from './utils/elementPlus'
import directive from './utils/directive'
import vueGlobalProperties from '@/utils/vueGlobalProperties'
import 'modern-css-reset'
import './styles/index.scss'
import 'uno.css'
import router from './router'
import store from './stores'
import 'virtual:svg-icons-register'
import '@codemirror/theme-one-dark'
import JsonViewer from 'vue3-json-viewer'
import 'vue3-json-viewer/dist/index.css'

try {
  const app = createApp(App)
  vueGlobalProperties(app), elementPlus(app)
  directive(app)
  app.use(router).use(JsonViewer).use(store).mount('#app')
} catch (err) {
  console.log(err)
}
