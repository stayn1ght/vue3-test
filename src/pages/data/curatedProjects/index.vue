<template>
  <div class="curatedProjects-page">
    <h1>Curated projects</h1>
    <div class="info mt-20px">
      <dl>
        <dt
          >In
          <logo class="font-bold" />
          , manually curation was performed for selected projects in order to:
        </dt>
        <dd>select usable runs with clearly defined phenotype,</dd>
        <dd
          >merge multiple runs if they correspond to the same sample, and calcualte taxon abundances
          on per-sample basis instead of per-run basis,
        </dd>
        <dd>group samples according to their corresponding phenotypes, and</dd>
        <dd
          >identify marker taxa between a pair of phenotypes of interests, e.g. CRC vs. Health.
        </dd>
      </dl>
      <dl>
        <dt
          >So far,
          <logo />
          includes:
        </dt>
        <dd
          ><span class="text-red-800 font-bold italic">{{ stats.projects_cnt }}</span> curated
          projects, for</dd
        >
        <dd
          ><span class="text-red-800 font-bold italic">{{ stats.phenotypes_cnt }}</span> phenotypes,
          involving</dd
        >
        <dd
          ><span class="text-red-800 font-bold italic">{{
            stats.samples_cnt?.toLocaleString()
          }}</span>
          samples.</dd
        >
      </dl>
      <dl>
        <dt>These data have been used to identify:</dt>
        <dd>
          <my-link :show-icon="false" to="/species/markerspecies"
            >marker taxa <i class="iconfont icon-right"></i
          ></my-link>
          , in
        </dd>
        <dd>
          pairs of
          <my-link to="/phenotypes/comparisons" :show-icon="false"
            >Phenotype comparisons <i class="iconfont icon-right"></i
          ></my-link>
          (e.g. Health vs. CRC).
        </dd>
      </dl>
    </div>
    <div class="search-wrapper mt-40px">
      <el-checkbox v-model="table.except" label="Except for..." class="pl-10px !mr-10px" />
      <el-input placeholder="Search term" v-model="table.keywords" />
      <el-button type="primary" :icon="Search" class="ml-10px" @click="searchTable"
        >Search</el-button
      >
      <el-button :icon="Refresh" round @click="refreshSearch" />
    </div>
    <el-table
      class="base-table mt-20px"
      border
      row-key="id"
      :default-expand-all="expandAll"
      :data="table.data"
      :span-method="mergeColumn"
      @sort-change="handleSortChange"
      :expand-row-keys="expandRowKeys"
    >
      <el-table-column sortable="custom" prop="parent">
        <template #header>
          <el-select v-model="tableType" style="width: 150px">
            <el-option label="ProjectID" value="ProjectId" />
            <el-option label="Phenotype" value="Phenotype" />
          </el-select>
          <el-button style="float: right" @click.stop="toggleExpand">
            <el-icon>
              <View v-if="!expandAll" />
              <Hide v-else />
            </el-icon>
          </el-button>
        </template>
        <el-table-column
          prop="name"
          sortable="custom"
          :label="columnLabel"
          :sort-orders="['descending', 'ascending']"
        >
          <template #default="{ row }">
            <template v-if="row.children">
              <my-link :to="parentInnerUrl + row.id" :show-icon="false">
                <span class="font-bold">{{ row.name }}</span>
                ({{ row.children.length }} entries)
                <i class="iconfont icon-right"></i>
              </my-link>
              <el-button
                v-if="tableType === 'ProjectID'"
                type="primary"
                size="small"
                style="margin-left: 10px"
                @click="navigateTo(parentOuterUrl + row['id'])"
              >
                NCBI&nbsp;
                <el-icon>
                  <Share />
                </el-icon>
              </el-button>
            </template>
            <template v-else>
              <my-link :to="childInnerUrl + row.idx">{{ row.name }}</my-link>
              <el-button
                type="primary"
                size="small"
                style="float: right"
                @click="navigateTo(childOuterUrl + row['idx'])"
              >
                link to: MeSH db&nbsp;
                <el-icon>
                  <Share />
                </el-icon>
              </el-button>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          :sort-orders="['descending', 'ascending']"
          sortable="custom"
          width="300"
          label="Nr.samples"
          prop="count"
        />
      </el-table-column>
    </el-table>
    <Pagination :total="table.total" @pagination="changePage" />
  </div>
</template>

<script setup lang="ts">
  import { useSaveScrollPosition } from '@/hooks/saveScrollPosition'
  import { CuratedProject, StatsProjects } from '@api/data/curatedProjects/types'
  import { getAllCuratedProjects } from '@api/data/curatedProjects'
  import { Share, Search, Refresh, Hide, View } from '@element-plus/icons-vue'

  const scrollTop = ref(0)
  useSaveScrollPosition(scrollTop)

  const expandAll = ref(true)
  const expandRowKeys = ref<any[]>([])
  const toggleExpand = () => {
    expandAll.value = !expandAll.value
    expandRowKeys.value = []
    if (expandAll.value) {
      table.data.forEach((item: any) => expandRowKeys.value.push(item.id))
    }
  }
  const parentInnerUrl = ref('/data/project/')
  const parentOuterUrl = ref('https://www.ncbi.nlm.nih.gov/bioproject/')
  const childInnerUrl = ref('/phenotypes/')
  const childOuterUrl = ref('https://meshb.nlm.nih.gov/record/ui?ui=')
  const tableType = ref('ProjectID')
  const columnLabel = ref('Phenotype')
  watch(tableType, (val) => {
    const urls = [
      '/data/project/',
      'https://www.ncbi.nlm.nih.gov/bioproject/',
      '/phenotypes/',
      'https://meshb.nlm.nih.gov/record/ui?ui='
    ]
    if (val === 'ProjectID') {
      parentInnerUrl.value = urls[0]
      parentOuterUrl.value = urls[1]
      childInnerUrl.value = urls[2]
      childOuterUrl.value = urls[3]
      columnLabel.value = 'Phenotype'
    } else if (val === 'Phenotype') {
      parentInnerUrl.value = urls[2]
      childInnerUrl.value = urls[0]
      childOuterUrl.value = urls[1]
      columnLabel.value = 'ProjectID'
    }
    refreshSearch()
  })
  const table = reactive({
    data: [] as any[],
    total: 0,
    page: 1,
    limit: 10,
    keywords: '',
    totalData: [] as any[],
    except: false
  })
  const stats = reactive<StatsProjects>({})
  const curatedProjects = ref<CuratedProject[]>([])
  const groupByPId = ref<any[]>([])
  const groupByPhenotype = ref<any[]>([])
  const initTableData = () => {
    const PIds = new Set()
    const dIds = new Set()
    const d2term: any = {}
    curatedProjects.value.forEach((p) => {
      PIds.add(p.project_id)
      dIds.add(p.phenotype)
      d2term[p.phenotype] = p.term
    })
    const groupPId: any = {}
    const groupPhenotype: any = {}
    PIds.forEach((i: any) => {
      groupPId[i] = []
    })
    dIds.forEach((i: any) => {
      groupPhenotype[i] = []
    })
    curatedProjects.value.forEach((p, index) => {
      const { project_id, phenotype } = p
      groupPId[project_id].push({
        id: `${project_id}_${index}`,
        idx: p.phenotype,
        name: p.term,
        count: p.samples_cnt
      })
      groupPhenotype[phenotype].push({
        id: `${phenotype}_${index}`,
        idx: p.project_id,
        name: p.project_id,
        count: p.samples_cnt
      })
    })
    for (let k in groupPId) {
      const item = {
        name: k,
        id: k,
        children: groupPId[k]
      }
      groupByPId.value.push(item)
    }
    for (let k in groupPhenotype) {
      const item = {
        name: d2term[k],
        id: k,
        children: groupPhenotype[k]
      }
      groupByPhenotype.value.push(item)
    }
    table.totalData = groupByPId.value.slice()
    table.total = table.totalData.length
    getTableData()
  }
  const refreshSearch = () => {
    table.keywords = ''
    table.except = false
    searchTable()
  }
  const searchTable = () => {
    if (tableType.value === 'ProjectID') {
      table.totalData = handleTreeData(groupByPId.value, table.keywords, table.except)
    } else {
      table.totalData = handleTreeData(groupByPhenotype.value, table.keywords, table.except)
    }
    table.page = 1
    table.total = table.totalData.length
    getTableData()
  }
  const handleTreeData = (treeData: any[], searchValue: any, exclude: boolean): any[] => {
    if (!treeData) {
      return []
    }
    const array = []
    for (let i = 0; i < treeData.length; i += 1) {
      let match = false
      for (let pro in treeData[i]) {
        if (typeof treeData[i][pro] == 'string') {
          match = treeData[i][pro].toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
          if (match) break
        }
      }
      if (!exclude) {
        if (match) array.push({ ...treeData[i] })
        else if (treeData[i].children) {
          const children = handleTreeData(treeData[i].children, searchValue, exclude)
          if (children.length > 0) {
            array.push({
              ...treeData[i],
              children
            })
          }
        }
      } else {
        if (treeData[i].children) {
          const children = handleTreeData(treeData[i].children, searchValue, exclude)
          if (children.length > 0) {
            array.push({
              ...treeData[i],
              children
            })
          }
        } else {
          if (!match) array.push({ ...treeData[i] })
        }
      }
    }
    return array
  }
  const changePage = (data: any) => {
    table.page = data.currentPage
    table.limit = data.pageSize
    getTableData()
  }
  const getTableData = () => {
    table.data = []
    table.data.push(
      ...table.totalData.slice((table.page - 1) * table.limit, table.page * table.limit)
    )
  }
  const handleSortChange = ({ prop, order }: any) => {
    if (prop === null) {
      table.totalData =
        tableType.value === 'ProjectID' ? groupByPId.value.slice() : groupByPhenotype.value.slice()
    } else if (prop === 'parent') {
      if (order === 'descending') table.totalData.sort((a, b) => (b.name > a.name ? 1 : -1))
      else if (order === 'ascending') table.totalData.sort((a, b) => (a.name > b.name ? 1 : -1))
    } else {
      table.totalData.forEach((item) => {
        if (order === 'descending')
          item.children.sort((a: any, b: any) => (b[prop] > a[prop] ? 1 : -1))
        else if (order === 'ascending')
          item.children.sort((a: any, b: any) => (a[prop] > b[prop] ? 1 : -1))
      })
    }
    getTableData()
  }
  const mergeColumn = ({ row, columnIndex }: any) => {
    if (row.children) {
      if (columnIndex === 0) return [1, 2]
      else if (columnIndex === 1) return [0, 0]
    }
  }
  getAllCuratedProjects(stats, curatedProjects, initTableData)

  const navigateTo = (url: string) => {
    window.open(url)
  }
</script>

<script lang="ts">
  export default {
    name: 'DataCuratedProjects'
  }
</script>

<style lang="less" scoped>
  .curatedProjects-page {
    .info {
      background: #f5f5f5;
      padding: 15px;
      margin-bottom: 20px;
      color: #666;

      dl {
        list-style-type: disc;
        margin-bottom: 15px;

        dd {
          display: list-item;
          margin-inline-start: 3em;
        }
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
