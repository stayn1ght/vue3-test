import { onActivated, Ref } from 'vue'
// @ts-ignore
import { onBeforeRouteLeave } from 'vue-router'

export const useSaveScrollPosition = (scrollTop: Ref<number>) => {
  onActivated(() => {
    const dom = document.querySelector('.el-scrollbar__wrap') as Element
    // dom.scrollTop = scrollTop.value
    document.body.scrollTop = scrollTop.value
    if (document.documentElement && document.documentElement.scrollTop) {
      document.documentElement.scrollTop = scrollTop.value
    } else if (document.body) {
      document.body.scrollTop = scrollTop.value
    }
  })
  onBeforeRouteLeave(() => {
    // const dom = document.querySelector('.el-scrollbar__wrap')
    // scrollTop.value = dom?.scrollTop ?? (0 as number)
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop.value = document.documentElement.scrollTop
    } else if (document.body) {
      scrollTop.value = document.body.scrollTop
    }
    // scrollTop.value = document.body?.scrollTop ?? (0 as number)
  })
}
