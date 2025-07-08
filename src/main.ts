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
import JsonViewer from 'vue3-json-viewer'

import VueCodemirror from 'vue-codemirror'
import { basicSetup } from 'codemirror'
try {
  const app = createApp(App)
  vueGlobalProperties(app), elementPlus(app)
  directive(app)
  app
    .use(router)
    .use(VueCodemirror, {
      autofocus: true,
      disabled: false,
      indentWithTab: true,
      tabSize: 2,
      placeholder: 'Code goes here...',
      extensions: [basicSetup]
      // ...
    })
    .use(JsonViewer)
    .use(store)
    .mount('#app')
} catch (err) {
  console.log(err)
}
