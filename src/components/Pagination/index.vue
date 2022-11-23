<template>
  <el-pagination
      v-model:current-page="state.currentPage"
      v-model:page-size="state.pageSize"
      background
      layout="prev, pager, next, jumper, sizes"
      :total="total"
      hide-on-single-page
      :default-page-size="10"
      :pager-sizes="[10, 25, 50, 100]"
  />
</template>

<script setup>
import { reactive, watch, getCurrentInstance } from 'vue'

defineProps({
  queryData: {
    // 查询数据
    type: Object,
    default: () => {
      return { pageSize: 10, currentPage: 1 }
    }
  },
  total: {
    type: Number,
    default: () => 0
  }
})

const { proxy } = getCurrentInstance()

// 将table 组件传过来值设置成响应式 在上面使用v-model:进行绑定,在下方使用watch进行监听并传给父组件
const state = reactive({
  currentPage: proxy.queryData.currentPage,
  pageSize: proxy.queryData.pageSize
})

const emit = defineEmits(['pagination'])

watch(state, (newVal) => {
  emit('pagination', newVal)
})
</script>
<style lang="less" scoped>
.el-pagination {
  padding: 10px;
  v-deep(.el-select) {
    .el-input__inner {
      height: 28px;
    }
  }
}
</style>
