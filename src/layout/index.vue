<template>
  <el-container class="h-100vh">
    <el-header style="position: fixed;
      width: 100%; z-index: 100; background: #fff">
      <my-header class="px-10 mx-auto md:w-screen-md lg:w-screen-lg xl:w-screen-xl" />
    </el-header>
    <div class="mt-60px px-10 mx-auto md:w-screen-md lg:w-screen-lg xl:w-screen-xl">
      <router-view v-slot="{ Component }">
        <keep-alive :include="includedList">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
    <div class="mt-20px" style="background-color: #f5f5f5">
      <my-footer class="!px-10 mx-auto md:w-screen-md lg:w-screen-lg xl:w-screen-xl" />
    </div>
    <!--    <el-main class="!p-0">-->
    <!--      <el-scrollbar class="pt-20px">-->
    <!--        <div class="px-10 mx-auto md:w-screen-md lg:w-screen-lg xl:w-screen-xl">-->
    <!--          <router-view v-slot="{ Component }">-->
    <!--            <keep-alive :include="includedList">-->
    <!--              <component :is="Component" />-->
    <!--            </keep-alive>-->
    <!--          </router-view>-->
    <!--        </div>-->
    <!--        <div class="h-80px mt-20px" style="background-color: #f5f5f5">-->
    <!--          <my-footer class="!px-10 mx-auto md:w-screen-md lg:w-screen-lg xl:w-screen-xl" />-->
    <!--        </div>-->
    <!--      </el-scrollbar>-->
    <!--    </el-main>-->
  </el-container>
</template>

<script setup lang="ts">
  import MyHeader from './components/MyHeader.vue'
  import MyFooter from './components/MyFooter.vue'

  const route = useRoute()
  const includedList = ref<string[]>([])
  if (route.meta.cached && includedList.value.indexOf(route.name) === -1) {
    includedList.value.push(route.name)
  }
  watch([route], () => {
    if (route.meta.cached && includedList.value.indexOf(route.name) === -1) {
      includedList.value.push(route.name)
    }
  })
  
</script>

<style scoped lang="less">
  .el-header {
    box-shadow: 0 1px 2px rgb(0 0 0 / 30%);
  }

  .el-footer {
    background-color: #eee;
    color: #87919f;
  }
</style>
