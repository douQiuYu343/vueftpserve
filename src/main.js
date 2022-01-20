import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElIconModules from '@element-plus/icons'

//createApp(App).use(store).use(router).use(VueAxios, axios).use(ElementPlus, {
//    locale: zhCn,
 //   size: 'small',
//    zIndex: 3000
//).mount('#app')

const app = createApp(App);

for(let iconName in ElIconModules){
    app.component(iconName,ElIconModules[iconName])
}
app.use(store);
app.use(router)
app.use(VueAxios, axios)
app.use(ElementPlus, {
    locale: zhCn,
    size: 'small',
    zIndex: 3000
});
app.mount('#app');

