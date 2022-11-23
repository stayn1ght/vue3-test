<template>
  <!-- Vue3组件模板结构中可以没有根标签 -->
  <router-view v-slot="{Component}">
    <keep-alive>
      <component :is="Component"></component>
    </keep-alive>
  </router-view>
</template>
<script setup lang="ts">
const route = useRoute()
const includedList = ref<string[]>([])
watch([route], () => {
  // route 用 [route] 来监听，因为 route 是一个对象，所以需要用数组包裹
  if (route.meta.cached && includedList.value.indexOf(route.name) === -1) {
    includedList.value.push(route.name)
  }
})
</script>

<style lang="less">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 13px;
  line-height: 1.846;
}

.base-table /deep/{
  .cell {
    //line-height:40px;
    font-size: 13px;
    word-wrap: normal;
    word-break: normal
  }

  &.el-table, .el-table__expanded-cell {
    background-color: transparent;
  }

  &.el-table tr, &.el-table tr th {
    background-color: transparent !important;
  }

  .el-table--enable-row-transition .el-table__body td, &.el-table .cell {
    background-color: transparent;
  }
}
</style>
