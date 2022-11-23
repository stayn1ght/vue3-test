<template>
  <div class="species-pane">
    <dl class="mb-20px">
      <dt class="mb-4"
        >Shown below are
        <span class="text-red-800 font-bold italic">{{ species.length.toLocaleString() }}</span>
        species found</dt
      >
      <dd>in >=2 samples</dd>
      <dd>with median relative abundances >=0.01%</dd>
    </dl>
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
      :default-sort="{ prop: 'presented_samples', order: 'descending' }"
      @sort-change="handleSortChange"
      expand
      @expand-change="expandChange"
      row-key="ncbi_taxon_id"
      :expand-row-keys="expandedRowKey"
    >
      <template #expand="{ row, $index }">
        <base-table
          :table-data="row.children || []"
          :table-head="subTableHead"
          :total="row.total || 0"
          class="ml-40px"
          pagi-class="ml-40px"
          style="border-left: 5px solid #aaa; width: calc(100% - 80px)"
          @pagination-change="
            (data) => {
              handleChangeSubTablePage(data, $index)
            }
          "
          :loading="row.loading"
        >
          <template #phenotype="{ row }">
            <my-link :to="`/phenotypes/${row.disease}`">{{ row.term }}</my-link>
          </template>
          <template #samples="{ row }">
            <span>{{ row.samples }} ({{ row.pct_samples.toFixed(3) }}%)</span>
          </template>
          <template #statistics="{ row }">
            <span>{{ row.abus_median.toFixed(4) }}, </span>
            <span>{{ row.abus_mean.toFixed(4) }}, </span>
            <span>{{ row.abus_sd.toFixed(4) }}</span>
          </template>
        </base-table>
      </template>
      <template #species="{ row }">
        <my-link :to="`/taxon/${row['ncbi_taxon_id']}`">{{ row['name'] }}</my-link>
        <div style="float: right">
          <el-tooltip
            content="view details of this disease at NCBI MeSH website in a new window/tab"
            effect="dark"
            placement="top"
          >
            <el-button
              type="primary"
              size="small"
              @click="
                navigateTo(
                  'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=' +
                    row['ncbi_taxon_id']
                )
              "
            >
              link to: NCBI Taxonomy&nbsp;
              <el-icon><Share /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip
            content="view details of this disease at NCBI MeSH website in a new window/tab"
            effect="dark"
            placement="top"
          >
            <el-button
              color="#626aef"
              type="primary"
              size="small"
              @click="
                navigateTo('https://www.ebi.ac.uk/ena/browser/view/Taxon:' + row['ncbi_taxon_id'])
              "
            >
              link to: ENA&nbsp;
              <el-icon><Share /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </template>
      <template #samples="{ row }">
        <span
          >{{ row['presented_samples'].toLocaleString() }} (
          {{ row['pct_of_all_samples'].toFixed(2) }}% )</span
        >
      </template>
    </base-table>
    <dl class="info">
      <dt>Note:</dt>
      <dd
        >a star symbol <i class="iconfont icon-star text-red-700 bg-red-100/30"></i> next to taxon
        names indicates marker taxon, which shows signficantly differential abundances between two
        phenotype types, e.g. health vs. disease.</dd
      >
      <dd
        >click the star symbol to
        <span class="bg-red-100/30 text-red-700"
          >view details of the corresponding marker taxa</span
        >
        in a new page.</dd
      >
      <dd
        >please check here to view a list of
        <my-link :show-icon="false" to="/phenotypes/comparisons"
          >phenotype comparisons <i class="iconfont icon-right"></i></my-link
        >, and</dd
      >
      <dd>here for a list of identified marker taxa .</dd>
      <dd
        ><span class="font-bold">Marker taxa</span> were identified in
        <span class="bg-red-100/30 text-red-700">curated projects</span> only, please see here for a
        list of
        <my-link :show-icon="false" to="/data/curatedprojects"
          >curated projects <i class="iconfont icon-right"></i></my-link
        >.</dd
      >
    </dl>
    <h3 class="text-2xl" style="padding: 2rem 0; border-top: 1px solid #eee">Statistics</h3>
    <el-row>
      <el-col :span="12">
        <v-plotly :plotly-data="plotlyData1" :plotly-layout="layout1" />
      </el-col>
      <el-col :span="12">
        <v-plotly :plotly-data="plotlyData2" :plotly-layout="layout2" />
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
  import { Share, Search, Refresh } from '@element-plus/icons-vue'
  import { Species } from '@api/taxon/types'
  import { getAssociatedTaxon } from '@api/taxon'
  const props = defineProps<{
    species: Species[]
  }>()
  watch(
    () => props.species,
    () => {
      searchTable()
      setPlotData()
    }
  )
  const handleSortChange = ({ prop, order }: any) => {
    table.totalData.sort((a: Species, b: Species) => {
      if (order === 'descending') {
        // @ts-ignore
        return b[prop] - a[prop]
      } else {
        // @ts-ignore
        return a[prop] - b[prop]
      }
    })
    getTableData()
  }
  const tableHead = [
    { label: 'Species', slotName: 'species', prop: 'name' },
    {
      label: 'Found in Nr. of samples (%)',
      slotName: 'samples',
      prop: 'presented_samples',
      sortable: 'custom',
      sortOrders: ['descending', 'ascending'],
      width: '250'
    },
    {
      label: 'Nr. of associated phenotypes',
      prop: 'nr_phenotypes',
      sortable: 'custom',
      sortOrders: ['descending', 'ascending'],
      width: '250'
    }
  ]
  const table = reactive({
    data: [] as Species[],
    total: 0,
    page: 1,
    limit: 10,
    keywords: '',
    totalData: [] as Species[],
    except: false
  })
  const searchTable = () => {
    expandedRowKey.value = []
    table.page = 1
    table.totalData = props.species.filter((item: Species) => {
      const keywords = table.keywords.toLowerCase()
      const itemStr = JSON.stringify(item).toLowerCase()
      if (!table.except) return itemStr.indexOf(keywords) !== -1
      else return itemStr.indexOf(keywords) === -1
    })
    table.total = table.totalData.length
    getTableData()
  }
  const refreshSearch = () => {
    table.keywords = ''
    table.except = false
    searchTable()
  }
  const changePage = (data: any) => {
    table.page = data.currentPage
    table.limit = data.pageSize
    getTableData()
  }
  const getTableData = () => {
    table.data = table.totalData.slice((table.page - 1) * table.limit, table.page * table.limit)
  }
  const navigateTo = (url: string) => {
    window.open(url)
  }

  const subTableHead = [
    { label: 'Phenotype', prop: 'term', slotName: 'phenotype' },
    {
      label: 'Found in nr. of samples of the respective phenotype (out of total %)',
      prop: 'samples',
      sortOrders: ['descending', 'ascending'],
      width: '500',
      slotName: 'samples'
    },
    {
      label: 'Abundance statistics, median, mean, SD',
      prop: 'abus_median',
      sortOrders: ['descending', 'ascending'],
      width: '350',
      slotName: 'statistics'
    }
  ]
  const expandedRowKey = ref<number[]>([])
  const expandChange = (row: Species, expandedRows: any) => {
    if (expandedRows.length > 0 && !row.children?.length) {
      getAssociatedTaxon(row.ncbi_taxon_id as number).then((res) => {
        const subChildren = res.phenotypes_associated_with_taxon.sort((a: any, b: any) => {
          return b.samples - a.samples
        })
        Object.assign(row, {
          children: subChildren.slice(0, 10),
          totalData: subChildren,
          page: 1,
          total: subChildren.length,
          limit: 10,
          loading: false
        })
      })
      row.expand = true
    } else {
      row.expand = !row.expand
    }
    if (row.expand) expandedRowKey.value.push(row.ncbi_taxon_id as number)
    else {
      const idx = expandedRowKey.value.indexOf(row.ncbi_taxon_id as number)
      if (idx !== -1) expandedRowKey.value.splice(idx, 1)
    }
  }
  const handleChangeSubTablePage = (data: any, rowIndex: number) => {
    const { currentPage, pageSize } = data
    table.data[rowIndex].page = currentPage
    table.data[rowIndex].limit = pageSize
    table.data[rowIndex].children = table.data[rowIndex]?.totalData?.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
  }

  const plotlyData1 = ref<any[]>([])
  const plotlyData2 = ref<any[]>([])
  const layout1 = {
    height: 420,
    margin: {
      t: 80,
      l: 80,
      b: 50,
      r: 10
    },
    title: 'Species prevalence in <b>phenotypes</b>',
    xaxis: {
      title: 'Nr. phenotypes in which a species is found'
    },
    yaxis: {
      title: 'Proportion of species'
    },
    legend: {
      x: 0.5,
      y: 1,
      orientation: 'h'
    }
  }
  const layout2 = {
    height: 420,
    margin: {
      t: 80,
      l: 80,
      b: 50,
      r: 10
    },
    title: 'Species prevalence in <b>samples</b>',
    xaxis: {
      title: 'Nr. samples in which a species is found'
    },
    yaxis: {
      title: 'Proportion of species'
    },
    legend: {
      x: 0.5,
      y: 1,
      orientation: 'h'
    }
  }
  const setPlotData = () => {
    let densitySpeciesSamples = {
      x: [] as any[],
      histnorm: 'probability',
      type: 'histogram'
    }
    let densitySpeciesPhenotypes = {
      x: [] as any[],
      histnorm: 'probability',
      type: 'histogram'
    }
    for (let i = 0; i < props.species.length; i++) {
      densitySpeciesPhenotypes.x.push(props.species[i].nr_phenotypes)
      densitySpeciesSamples.x.push(props.species[i].presented_samples)
    }
    plotlyData1.value = [densitySpeciesPhenotypes]
    plotlyData2.value = [densitySpeciesSamples]
  }
</script>

<style lang="less" scoped>
  .species-pane {
    dl {
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
    .info {
      background: #f5f5f5;
      padding: 15px;
      margin-bottom: 2rem;
      color: #666;
    }
  }
</style>
