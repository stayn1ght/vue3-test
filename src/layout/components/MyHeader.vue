<template>
  <div class="page-header">
    <router-link to="/home" class="inline-block h-full">
      <img
        src="http://www.chenlab.medgenius.info/images/labphoto.jpg"
        class="h-full w-auto"
        alt="home"
      />
      <!-- src="https://gmrepo.humangut.info/views/images/logo.png" -->
    </router-link>
    <div class="search-wrapper">
      <el-autocomplete
        class="w-full"
        v-model="keywords"
        :suffix-icon="Search"
        placeholder="search in GMrepo"
        :fetch-suggestions="querySearchAsync"
        @select="handleSelect"
        size="large"
      />
    </div>
    <el-menu
      mode="horizontal"
      :default-active="activeIndex"
      @select="handleRouteSelect"
      style="float: right"
      class="!border-0"
      :ellipsis="false"
    >
      <template v-for="route in routes">
        <el-menu-item v-if="route.path" :key="route.name" :index="route.path">
          <el-icon><component :is="route.icon" /></el-icon>
          {{ route.name }}
        </el-menu-item>
        <el-sub-menu v-else :key="route.name" :index="route.name">
          <template #title>
            <el-icon><component :is="route.icon" /></el-icon>
            {{ route.name }}
          </template>
          <el-menu-item v-for="item in route.children" :key="item.name" :index="item.path">
            {{ item.name }}
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
  import {
    PriceTag,
    Search,
    HomeFilled,
    DataAnalysis,
    InfoFilled,
    Histogram
  } from '@element-plus/icons-vue'
  import { searchPage } from '@api/home'
  import { QueryResult } from '@api/home/types'

  const keywords = ref('')

  let timeout: NodeJS.Timeout
  const querySearchAsync = (query: string, cb: (args: any) => void) => {
    if (query === '') return cb([])
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(async () => {
      // 搜索API
      const res: QueryResult = await searchPage(query)
      const searchResult = res.map((item: any) => {
        const url = JSON.parse(item.url)
        return {
          value: item[0],
          link: url
        }
      })
      cb(searchResult)
    }, 500)
  }
  const handleDataCat = (key: string) => {
    switch (key) {
      case 'comparisons':
        return 'phenotypes/comparisons'
      case 'project':
        return 'data/project'
      case 'run':
        return 'data/run'
      case 'curatedsample':
        return 'data/curatedsample'
      default:
        return key
    }
  }
  const handleSelect = (item: any) => {
    const ids = item.link.datakey.split('||')
    let url = `/${handleDataCat(item.link.datacat)}/`
    console.log(url)
    if (ids.length === 1) url += `${ids[0]}`
    else url += `${ids[0]}/${ids[1]}`
    router.push(url)
  }

  interface Route {
    name: String
    path?: String
    children?: Route[]
    icon?: Object
  }

  const router = useRouter()
  const routes: Route[] = [
    {
      name: 'Home',
      path: '/home',
      icon: HomeFilled
    },
    {
      name: 'Phenotypes',
      icon: PriceTag,
      children: [
        {
          name: 'All phenotypes',
          path: '/phenotypes'
        },
        {
          name: 'Phenotype comparisons',
          path: '/phenotypes/comparisons'
        }
      ]
    },
    {
      name: 'Taxa',
      icon: Histogram,
      children: [
        {
          name: 'All taxa',
          path: '/taxon'
        },
        {
          name: 'Marker taxa',
          path: '/taxon/marker'
        }
      ]
    },
    {
      name: 'Data',
      icon: DataAnalysis,
      children: [
        {
          name: 'All projects and runs',
          path: '/data'
        },
        {
          name: 'Curated projects',
          path: '/data/curatedProjects'
        }
      ]
    },
    {
      name: 'Help',
      icon: InfoFilled,
      path: 'https://evolgeniusteam.github.io/gmrepodocumentation/'
    }
  ]
  const handleRouteSelect = (key: string, keyPath: string) => {
    if (key.match(/^http/) !== null) window.open(key)
    else router.push(key)
  }
  const activeIndex = computed(() => {
    return router.currentRoute.value.fullPath
  })
</script>

<style scoped lang="less">
  .page-header {
    height: 100%;
    .search-wrapper {
      width: 350px;
      font-size: 16px;
      vertical-align: top;
      margin-top: 9px;
      margin-left: 20px;
      display: inline-block;
    }
    ::v-deep(.el-menu-item),
    ::v-deep(.el-sub-menu__title) {
      padding: 0 12px;
    }
  }
</style>
