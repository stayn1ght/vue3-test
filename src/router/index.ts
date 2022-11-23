// @ts-ignore
import { createRouter, createWebHashHistory } from 'vue-router'
import generatedRoutes from 'virtual:generated-pages'
// @ts-ignore
import { setupLayouts } from 'virtual:generated-layouts'

generatedRoutes.push(
  ...[
    {
      path: '/species/markerspecies',
      redirect: '/taxon/marker'
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/home'
    }
  ]
)

const routes = setupLayouts(generatedRoutes)

// 可以看出路由作为参数传递到了layout组件中
const router = createRouter({
  history: createWebHashHistory(), // 使用hash模式
  routes // 路由规则
})

export default router
