<template>
  <div class="comparisons-page">
    <h1>Phenotype comparisons</h1>
    <div class="info mt-20px">
      <dl class="mt-10px">
        <dt
          >The aims of <span class="text-red-500 bg-red-100/30">phenotype comparisons</span> are
          to:</dt
        >
        <dd>
          <span class="text-red-500 bg-red-100/30">identify</span>&nbsp;
          <my-link :show-icon="false" to="/species/markerspecies">
            marker taxa
            <i class="iconfont icon-right"></i>
          </my-link>
          that show significantly differential abundances between two phenotypes (e.g. health vs.
          disease),
        </dd>
        <dd>
          <span class="text-red-500 bg-red-100/30">cross validate</span>
          marker taxa in different projects relating to the same phenotype comparisons, and
        </dd>
        <dd
          >reveal <span class="text-red-500 bg-red-100/30">shared and unique</span> marker taxa in
          different phenotype comparisons, e.g. microbial markers that are shared by multiple
          diseases and those that are unique to a specific disease.
        </dd>
      </dl>
      <dl class="mt-10px">
        <dt>Thus, marker taxa analysis (i.e. LEfSe) were performed</dt>
        <dd
          >between two phenotypes at a time, very often between a disease phenotype and healthy
          controls,</dd
        >
        <dd>on per-project basis, and</dd>
        <dd
          >for
          <my-link :show-icon="false" to="/data/curatedProjects">
            curated projects
            <i class="iconfont icon-right"></i>
          </my-link>
          only.
        </dd>
      </dl>
      <dl class="mt-10px mb-10px">
        <dt
          >So far,
          <logo class="font-bold" />
          includes
        </dt>
        <dd
          ><span class="text-red-800 font-bold italic">{{ stats.markers }}</span> phenotype
          comparisons, from</dd
        >
        <dd
          ><span class="text-red-800 font-bold italic">{{ stats.phenotypeCombinations }}</span
          >&nbsp;
          <my-link :show-icon="false" to="/data/curatedProjects">
            curated projects
            <i class="iconfont icon-right"></i>
          </my-link>
          , in which
        </dd>
        <dd
          ><span class="text-red-800 font-bold italic">{{ stats.projects }}</span
          >&nbsp;
          <my-link :show-icon="false" to="/species/markerspecies">
            marker taxa
            <i class="iconfont icon-right"></i>
          </my-link>
          were identified.
        </dd>
      </dl>
    </div>
    <div class="search-wrapper">
      <el-checkbox v-model="table.except" label="Except for..." class="pl-10px !mr-10px" />
      <el-input placeholder="Search term" v-model="table.keywords" />
      <el-button type="primary" :icon="Search" class="ml-10px" @click="searchTable"
        >Search</el-button
      >
      <el-button :icon="Refresh" round @click="refreshSearch" />
    </div>
    <base-table
      @pagination-change="changePage"
      :table-data="table.data"
      :table-head="tableHead"
      :total="table.total"
      :default-sort="{ prop: 'markers', order: 'descending' }"
      @sort-change="handleSortChange"
    >
      <template #phenotype1="{ row }">
        <my-link :to="`/phenotypes/${row['phenotype1']}`">{{ row['phenotype1_term'] }}</my-link>
        <el-tooltip
          content="view details of this disease at NCBI MeSH website in a new window/tab"
          effect="dark"
          placement="top"
        >
          <el-button
            type="primary"
            size="small"
            style="float: right"
            @click="navigateTo(row['phenotype1'])"
          >
            link to: MeSH db&nbsp;
            <el-icon><Share /></el-icon>
          </el-button>
        </el-tooltip>
      </template>
      <template #phenotype2="{ row }">
        <my-link :to="`/phenotypes/${row['phenotype2']}`">{{ row['phenotype2_term'] }}</my-link>
        <el-tooltip
          content="view details of this disease at NCBI MeSH website in a new window/tab"
          effect="dark"
          placement="top"
        >
          <el-button
            type="primary"
            size="small"
            style="float: right"
            @click="navigateTo(row['phenotype2'])"
          >
            link to: MeSH db&nbsp;
            <el-icon><Share /></el-icon>
          </el-button>
        </el-tooltip>
      </template>
      <template #operation="{ row }">
        <my-link
          :show-icon="false"
          :to="`/phenotypes/comparisons/${row.phenotype1}/${row.phenotype2}`"
        >
          view details
          <i class="iconfont icon-right"></i>
        </my-link>
      </template>
    </base-table>
  </div>
</template>

<script setup lang="ts">
  import { useSaveScrollPosition } from '@/hooks/saveScrollPosition'
  import { Comparison } from '@api/comparisons/types'
  import { getAllPhenotypeComparisons } from '@api/comparisons'
  import { Phenotype } from '@api/phenotypes/types'
  import { Share, Search, Refresh } from '@element-plus/icons-vue'
  import { useTableTools } from '@/hooks/table'
  const scrollTop = ref(0)
  useSaveScrollPosition(scrollTop)

  const tableHead = [
    { label: 'Phenotype1', slotName: 'phenotype1', prop: 'phenotype1_term' },
    { label: 'Phenotype2', slotName: 'phenotype2', prop: 'phenotype2_term' },
    {
      label: 'Nr. projects',
      prop: 'projects',
      width: '130',
      sortable: 'custom',
      sortOrders: ['descending', 'ascending']
    },
    {
      label: 'Nr. marker taxa',
      prop: 'markers',
      width: '150',
      sortable: 'custom',
      sortOrders: ['descending', 'ascending']
    },
    { label: '', slotName: 'operation', sortable: false, width: '130' }
  ]
  const table = reactive({
    data: [] as Comparison[],
    total: 0,
    page: 1,
    limit: 10,
    keywords: '',
    totalData: [] as Comparison[],
    except: false
  })
  const comparisons = ref<Comparison[]>([])
  const stats = reactive({
    markers: 0,
    phenotypeCombinations: 0,
    projects: 0
  })
  const { handleSortChange, searchTable, refreshSearch, changePage, getTableData } =
    useTableTools<Comparison>(comparisons, table)
  getAllPhenotypeComparisons(comparisons, stats, searchTable)

  const navigateTo = (disease: string) => {
    window.open('https://meshb.nlm.nih.gov/record/ui?ui=' + disease)
  }
</script>

<script lang="ts">
  export default {
    name: 'PhenotypesComparisons'
  }
</script>

<style lang="less" scoped>
  .comparisons-page {
    .info {
      background: #f5f5f5;
      padding: 15px;
      margin-bottom: 20px;
      color: #666;
      list-style-type: disc;

      dd {
        display: list-item;
        margin-inline-start: 3em;
      }
    }
    .search-wrapper {
      display: flex;
      .el-input {
        flex: 1;
      }
    }
  }
</style>
