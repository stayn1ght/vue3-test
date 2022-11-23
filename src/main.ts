// 引入的不再是Vue的构造函数了，引入的名为createApp的工厂函数
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import piniaStore from './store'
import { Anchor, AnchorLink } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './index.css'
//改为element-plus默认UI
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'virtual:windi.css'
import './assets/iconfont/iconfont.css'
// 支持SVG
import 'virtual:svg-icons-register'

// 创建应用实例对象 —— app（类似于Vue2中的vm，但app更加轻量，身上的属性和方法更少）
const app = createApp(App)
// @ts-ignore
// 应用插件
app.use(Anchor).use(AnchorLink)
app.use(router).use(ElementPlus).use(piniaStore).mount('#app')

/* new Vue({
    render: h => h(App),
}).$mount('#app') */