/**
 * @name ConfigPagesPlugin
 * @description 动态生成路由
 */
import Pages from 'vite-plugin-pages'
export const ConfigPagesPlugin = () => {
  return Pages({
    pagesDir: [{ dir: 'src/pages', baseRoute: '' }],
    extensions: ['vue', 'md'],
    exclude: ['**/components/**/*.vue'],
    nuxtStyle: true,
    extendRoute(route) {
      if (route.path === '/phenotypes/comparisons/detail') {
        // 自动路由检索会产生一个comparison/detail，
        // 实际上我们需要一个动态路由
        route.path = '/phenotypes/comparisons/:id1/:id2'
      } else if (route.path === '/phenotypes/speciesdetail') {
        route.path = '/phenotypes/:disease/:taxon'
      } else if (route.path === '/data/project/comparisondetail') {
        route.path = '/data/project/:pid/:disease1/:disease2'
      }
      route.meta = { cached: true }
      if (route.path.indexOf(':id') !== -1) {
        route.meta = {
          cached: false
        }
      }
      return route
    }
  })
}
