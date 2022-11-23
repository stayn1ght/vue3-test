<template>
  <div class="comparisons-detail-page">
    <h1>
      <my-link :to="`/phenotypes/${id1}`">{{ stats.phenotype1_term }}</my-link>
      vs.
      <my-link :to="`/phenotypes/${id2}`">{{ stats.phenotype2_term }}</my-link>
    </h1>
    <div class="info">
      <dl>
        <dt>
          In total
          <span class="text-red-800 font-bold italic">{{ stats.markers }}</span>
          <span class="bg-red-100/30 text-red-800">marker taxa</span>
          , including
        </dt>
        <dd>
          <span class="text-red-800 font-bold italic">{{ stats.marker_species }}</span>
          marker <span class="font-bold">species</span> and
        </dd>
        <dd>
          <span class="text-red-800 font-bold italic">{{ stats.marker_genus }}</span>
          marker <span class="font-bold">genera</span>,
        </dd>
      </dl>
      <dl>
        <dt>have been identified between the two phenotypes:</dt>
        <dd>
          <my-link :to="`/phenotypes/${id1}`">{{ stats.phenotype1_term }}</my-link>
          and
        </dd>
        <dd>
          <my-link :to="`/phenotypes/${id2}`">{{ stats.phenotype2_term }}</my-link>
        </dd>
      </dl>
      from <span class="text-red-800 font-bold italic">{{ stats.projects }}</span>
      <my-link to="/data/curatedprojects" :show-icon="false">
        curated projects <i class="iconfont icon-right"></i>
      </my-link>
    </div>
    <h2>Tile view</h2>
    <span class="font-bold align-bottom"> Markers to show: </span>
    <el-radio-group v-model="d3Data.markertype" size="small">
      <el-radio-button label="" :disabled="stats.markers && stats.markers <= 0"
        >ALL</el-radio-button
      >
      <el-radio-button
        label="species"
        :disabled="stats.marker_species && stats.marker_species <= 0"
      >
        SPECIES
      </el-radio-button>
      <el-radio-button label="genus" :disabled="stats.marker_genus && stats.marker_genus <= 0"
        >GENUS</el-radio-button
      >
    </el-radio-group>
    <el-form inline v-model="d3Data.plotoptions" class="mt-10px" size="small">
      <el-form-item class="!mb-2px" label="NR. PROJECTS(>=):">
        <template #label="{ label }">
          <span class="bg-fuchsia-700 text-gray-50 rounded-sm px-5px">{{ label }}</span>
        </template>
        <el-input-number
          v-model="d3Data.plotoptions.nrproj"
          :min="1"
          :max="10"
          :step="1"
          controls-position="right"
          size="small"
          style="width: 80px"
        />
      </el-form-item>
      <el-form-item class="!mb-2px" label="|LDA SCORE|>=:">
        <template #label="{ label }">
          <span class="bg-fuchsia-700 text-gray-50 rounded-sm px-5px">{{ label }}</span>
        </template>
        <el-input-number
          v-model="d3Data.plotoptions.ldacutoff"
          :min="2"
          :max="10"
          :step="0.1"
          controls-position="right"
          size="small"
          style="width: 80px"
        />
      </el-form-item>
      <el-form-item class="!mb-2px" label="EXCLUDE CONFLICTING MARKERS:">
        <template #label="{ label }">
          <span class="bg-fuchsia-700 text-gray-50 rounded-sm px-5px">{{ label }}</span>
        </template>
        <el-checkbox v-model="d3Data.plotoptions.exclude" label="" size="small" />
      </el-form-item>
      <el-form-item class="!mb-2px" label="TILE SIZE (PX):">
        <template #label="{ label }">
          <span class="bg-blue-500 text-gray-50 rounded-sm px-5px">{{ label }}</span>
        </template>
        <el-input-number
          v-model="d3Data.plotoptions.itemsize"
          :min="10"
          :max="40"
          :step="1"
          controls-position="right"
          size="small"
          style="width: 80px"
        />
      </el-form-item>
      <el-form-item class="!mb-2px" label="TILE MARGIN (PX):" style="margin-right: 0">
        <template #label="{ label }">
          <span class="bg-blue-500 text-gray-50 rounded-sm px-5px">{{ label }}</span>
        </template>
        <el-input-number
          v-model="d3Data.plotoptions.margin"
          :min="0.1"
          :max="5"
          :step="0.1"
          controls-position="right"
          size="small"
          style="width: 80px"
        />
      </el-form-item>
    </el-form>
    <el-select
      size="large"
      @change="handleAxisChange"
      v-model="selected"
      placeholder="Find marker taxon by scientific name ..."
      style="width: 100%"
    >
      <el-option v-for="item in selectorData" :key="item" :label="item" :value="item" />
    </el-select>
    <div :class="baseLayer ? 'svg-plot' : ''" ref="svgPlot"></div>
    <div style="text-align: right" v-if="baseLayer">
      <el-button size="small" color="#9c27b0" @click="downloadPng"> SAVE AS PNG </el-button>
      <el-button class="ml-3px" size="small" color="#9c27b0" @click="downloadSvg">
        SAVE AS SVG
      </el-button>
    </div>
    <dl class="info">
      <dt>Note:</dt>
      <dd>
        Marker taxa with <span style="background-color: #cbf0e3">LDA &lt; 0</span> are
        <my-link :to="`/phenotypes/${id1}`">{{ stats.phenotype1_term }}</my-link>
        enriched, while those with <span style="background-color: #fce7ec">LDA &gt; 0 </span> are
        <my-link :to="`/phenotypes/${id2}`">{{ stats.phenotype2_term }}</my-link>
        enriched.
      </dd>
      <dd>
        <dl>
          <dt>
            Use the <span class="bg-red-100/30 text-red-800">number spinners </span>on top of the
            plot to change your choices:
            <img src="../../../assets/images/number_spinner.png" />
          </dt>
          <dd>
            The spinners can be shown correctly under Safari, Opera and Firefox (latest versions).
          </dd>
          <dd>
            In <span class="bg-red-100/30 text-red-800">Google Chrome</span>, users may
            <span class="bg-red-100/30 text-red-800">mouse over</span> the input fields to see the
            spinners.
          </dd>
          <dd>
            Use the
            <span class="bg-red-100/30 text-red-800">IE</span> browsers may not support number
            spinners (not tested).
          </dd>
        </dl>
      </dd>
      <dd>
        Use the <span class="bg-red-100/30 text-red-800">Exclude conflicting markers </span> button
        <img src="../../../assets/images/exclude_conflicting_markers.png" /> to hide/show marker
        taxa that show inconsistent changes in current pair of phenoetypes. Default is
        <span class="bg-red-100/30 text-red-800">hide</span>.
      </dd>
      <dd>
        Use the <span class="bg-red-100/30 text-red-800">SAVE AS PNG</span> and
        <span class="bg-red-100/30 text-red-800">SAVE AS SVG</span> buttons to download the plot.
      </dd>
      <dd>
        <dl>
          <dt>Other widges include: </dt>
          <dd>Tile size: to adjust the width and height of the tiles;</dd>
          <dd>Tile margin: to adjust the distance between the tiles.</dd>
        </dl>
      </dd>
    </dl>
    <h2>Table view</h2>
    <el-table
      class="base-table mt-20px"
      border
      row-key="id"
      :default-expand-all="expandAll"
      :data="table.data"
      :span-method="mergeColumn"
      :expand-row-keys="expandRowKeys"
      @sort-change="handleViewSortChange"
      :cell-class-name="setQcStatusBg"
    >
      <el-table-column sortable="custom" prop="parent" :sort-orders="['descending', 'ascending']">
        <template #header>
          <el-select v-model="tableType" style="width: 200px">
            <el-option label="ProjectID" value="pid" />
            <el-option label="Marker taxon" value="taxon" />
          </el-select>
          <el-button style="float: right" @click.stop="toggleExpand">
            <el-icon>
              <View v-if="!expandAll" />
              <Hide v-else />
            </el-icon>
          </el-button>
        </template>
        <el-table-column :sortable="false" :label="columnLabel">
          <template #header>
            {{ columnLabel }}
            <el-input
              v-model="searchForm.name"
              style="width: calc(100% - 80px); display: inline"
              @click.stop
            />
          </template>
          <template #default="{ row }">
            <template v-if="row.children">
              <my-link to="" :show-icon="false">
                <span class="font-bold">{{ row.name }}</span>
                ({{ row.children.length }} entries)
              </my-link>
            </template>
            <template v-else>
              <template v-if="tableType === 'pid'">
                <my-link :to="`/taxon/${row.ncbi_taxon_id}`" :show-icon="false">
                  {{ row.scientific_name }}
                  <i class="iconfont icon-star"></i>
                </my-link>
                <el-tooltip
                  content="click to view details in a new window/tab"
                  effect="dark"
                  placement="top"
                >
                  <el-button
                    color="#951FA1"
                    size="small"
                    style="float: right"
                    @click="
                      navigateTo(
                        `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=${row.ncbi_taxon_id}`
                      )
                    "
                  >
                    link to: NCBI&nbsp;
                    <el-icon><Share /></el-icon>
                  </el-button>
                </el-tooltip>
              </template>
              <template v-else>
                <my-link :to="`/data/project/${row.project_id}`">{{ row.project_id }}</my-link>
                <el-tooltip
                  content="click to view it in NCBI BioProject"
                  effect="dark"
                  placement="top"
                >
                  <el-button
                    size="small"
                    type="primary"
                    style="float: right"
                    @click="navigateTo(`https://www.ncbi.nlm.nih.gov/bioproject/${row.project_id}`)"
                  >
                    NCBI&nbsp;
                    <el-icon><Share /></el-icon>
                  </el-button>
                </el-tooltip>
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="taxon_rank_level"
          :sortable="false"
          width="300"
          label="Taxonomic rank"
        >
          <template #header>
            {{ columnLabel }}
            <el-select v-model="searchForm.rank" style="width: 100px" size="small">
              <el-option label="All" value="" />
              <el-option label="Species" value="species" />
              <el-option label="Genus" value="genus" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          :sort-orders="['descending', 'ascending']"
          sortable="custom"
          width="200"
          label="LDA score"
          prop="LDA"
        >
          <template #default="{ row }">{{ row.LDA?.toFixed(3) }}</template>
        </el-table-column>
        <el-table-column
          :sort-orders="['descending', 'ascending']"
          sortable="custom"
          label="Experiment type"
          prop="experiment_type"
          width="200"
        />
      </el-table-column>
    </el-table>
    <Pagination :total="table.total" @pagination="changePage" />
    <div class="mt-20px">
      <my-link :show-icon="false" to="" @click="getTableFile">
        Download the above table as tsv
        <el-icon> <Download /> </el-icon>
      </my-link>
      <dl class="info">
        <dt>Note:</dt>
        <dd>
          Data in this table could be groupped by
          <span class="bg-red-100/30 text-red-800">ProjectID</span>
          (default) or
          <span class="bg-red-100/30 text-red-800">Marker taxon</span>.
        </dd>
        <dd>
          LDA scores <span style="background: #cbf0e3">less than 0</span> indicate
          <my-link :to="`/phenotypes/${id1}`">{{ stats.phenotype1_term }}</my-link>
          enriched taxa, while LDA scores
          <span class="bg-red-100/30">larger than 0</span> indicate
          <my-link :to="`/phenotypes/${id2}`">{{ stats.phenotype2_term }}</my-link>
          enriched taxa.
        </dd>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
  import * as d3 from 'd3'
  import { Share, Download, View, Hide } from '@element-plus/icons-vue'
  import { getAllComparisonDetails } from '@api/comparisons/detail'
  import { ResAlldata, ResStats } from '@api/comparisons/detail/types'
  import { doPlot } from '@utils/d3/visPhenotypeComparisons'
  import { download, getSVGString, svgString2Image } from '@/utils'

  const router = useRouter()
  const {
    params: { id1, id2 }
  } = router.currentRoute.value

  const stats = reactive<ResStats>({})
  const allData = ref<ResAlldata[]>([])

  const d3Data = reactive({
    data: null,
    plotoptions: {
      nrproj: 1,
      itemsize: 12,
      margin: 0.5,
      ldacutoff: 2,
      exclude: true
    },
    markertype: ''
  })
  const selectorData = ref<string[]>([])
  const selected = ref('')
  const xaxisG = ref()
  const svgPlot = ref()
  const baseLayer = ref()
  watch([() => d3Data.markertype, d3Data.plotoptions], () => {
    selected.value = ''
    baseLayer.value = doPlot(d3Data, svgPlot.value, selectorData, xaxisG)
  })
  const downloadPng = () => {
    const save = (blob: any) => {
      download(blob, 'phenotype_combinations.png')
    }
    const svgString = getSVGString(baseLayer.value.node())
    svgString2Image(
      svgString,
      2 * svgPlot.value.offsetWidth,
      2 * svgPlot.value.offsetHeight,
      'png',
      save
    )
  }
  const downloadSvg = () => {
    const svgString = getSVGString(baseLayer.value.node())
    download(
      new Blob([svgString], {
        type: 'image/svg+xml'
      }),
      'phenotype_combination.svg'
    )
  }
  const handleAxisChange = (val: string) => {
    xaxisG.value.selectAll('g').each(function (d: string) {
      if (d === val) {
        d3.select(this).style('fill', 'red')
      } else {
        d3.select(this).style('fill', null)
      }
    })
  }

  const table = reactive({
    data: [] as any[],
    total: 0,
    page: 1,
    limit: 10,
    totalData: [] as any[]
  })
  const expandAll = ref(true)
  const expandRowKeys = ref<any[]>([])
  const toggleExpand = () => {
    expandAll.value = !expandAll.value
    expandRowKeys.value = []
    if (expandAll.value) {
      table.data.forEach((item: any) => expandRowKeys.value.push(item.id))
    }
  }
  const columnLabel = ref('ProjectID')
  const tableType = ref('pid')
  const groupByPid = ref<any[]>([])
  const groupByTaxon = ref<any[]>([])
  const initTableData = () => {
    const pids = new Set()
    const taxons = new Set()
    allData.value.forEach((m) => {
      pids.add(m.project_id)
      taxons.add(m.scientific_name)
    })
    const groupPid: any = {}
    const groupTaxon: any = {}
    pids.forEach((i: any) => (groupPid[i] = []))
    taxons.forEach((i: any) => (groupTaxon[i] = []))
    allData.value.forEach((m, index) => {
      const { project_id, scientific_name } = m
      groupPid[project_id].push({
        id: `${project_id}_${index}`,
        ...m
      })
      groupTaxon[scientific_name].push({
        id: `${scientific_name}_${index}`,
        ...m
      })
    })
    for (const k in groupPid) {
      const item = {
        name: k,
        id: k,
        children: groupPid[k]
      }
      groupByPid.value.push(item)
    }
    for (const k in groupTaxon) {
      const item = {
        name: k,
        id: k,
        children: groupTaxon[k]
      }
      groupByTaxon.value.push(item)
    }
    table.totalData = groupByPid.value.slice()
    table.total = table.totalData.length
    getTableData()
  }
  watch(tableType, (val) => {
    if (val === 'pid') {
      columnLabel.value = 'Marker taxon'
    } else {
      columnLabel.value = 'ProjectID'
    }
    refreshSearch()
  })
  const changePage = (data: any) => {
    table.page = data.currentPage
    table.limit = data.pageSize
    getTableData()
  }
  const searchTableData = () => {
    let totalData
    if (tableType.value === 'pid') {
      totalData = JSON.parse(JSON.stringify(groupByPid.value))
    } else {
      totalData = JSON.parse(JSON.stringify(groupByTaxon.value))
    }
    const { rank, name } = searchForm
    for (let i = 0; i < totalData.length; i++) {
      if (rank.length)
        totalData[i].children = totalData[i].children.filter(
          (item: any) => item.taxon_rank_level === rank
        )
      if (name.length)
        totalData[i].children = totalData[i].children.filter((item: any) => {
          if (tableType.value === 'pid')
            return item.scientific_name?.toLowerCase()?.indexOf(name.toLowerCase()) !== -1
          else return item.project_id?.toLowerCase()?.indexOf(name.toLowerCase()) !== -1
        })
    }
    table.page = 1
    table.total = totalData.length
    table.totalData = totalData
    getTableData()
  }
  const getTableData = () => {
    table.data = []
    table.data.push(
      ...table.totalData.slice((table.page - 1) * table.limit, table.page * table.limit)
    )
  }
  const refreshSearch = () => {
    searchForm.name = ''
    searchForm.rank = ''
    searchTableData()
  }
  const searchForm = reactive({
    rank: '',
    name: ''
  })
  watch(searchForm, () => {
    searchTableData()
  })
  const mergeColumn = ({ row, columnIndex }: any) => {
    if (row.children) {
      if (columnIndex === 0) return [1, 4]
      else return [0, 0]
    }
  }
  const handleViewSortChange = ({ prop, order }: any) => {
    if (prop === null)
      table.totalData =
        tableType.value === 'pid' ? groupByPid.value.slice() : groupByTaxon.value.slice()
    else if (prop === 'parent') {
      if (order === 'descending')
        table.totalData.sort((a: any, b: any) => (b.name > a.name ? 1 : -1))
      else if (order === 'ascending')
        table.totalData.sort((a: any, b: any) => (a.name > b.name ? 1 : -1))
    } else {
      for (let i = 0; i < table.totalData.length; i++) {
        table.totalData[i].children.sort((a: any, b: any) => {
          if (order === 'descending') return b[prop] > a[prop] ? 1 : -1
          if (order === 'ascending') return a[prop] > b[prop] ? 1 : -1
        })
      }
    }
    getTableData()
  }
  const setQcStatusBg = ({ row, columnIndex }: any) => {
    if (columnIndex === 2) {
      if (row['LDA'] < 0) return 'bg-green-100/30'
      else if (row['LDA'] > 0) return 'bg-red-100/30'
      return 'bg-gray-100/30'
    }
  }

  const getTableFile = () => {
    let contents =
      '#in total ' +
      stats.markers +
      ' marker taxa were identified between ' +
      stats.mesh_id1 +
      '(' +
      stats.phenotype1_term +
      ') and ' +
      stats.mesh_id2 +
      '(' +
      stats.phenotype2_term +
      ')\n'
    contents +=
      [
        'project id',
        'scientific name',
        'ncbi taxon id',
        'taxonomic rank',
        'LDA',
        'nr. projects in which this taxon is a marker'
      ].join('\t') + '\n'

    for (let l = 0; l < allData.value.length; l++) {
      const row = allData.value[l]
      contents +=
        [
          row.project_id,
          row.scientific_name,
          row.ncbi_taxon_id,
          row.taxon_rank_level,
          row.LDA,
          row.nrproj
        ].join('\t') + '\n'
    }
    const fileData = new Blob([contents], {
      type: 'text/plain;charset=utf-8'
    })
    const filename =
      'marker_taxa_in_phenotype_comparison_between_' +
      stats.mesh_id1 +
      '_' +
      stats.mesh_id2 +
      '.txt'
    download(fileData, filename)
  }

  getAllComparisonDetails({ mesh_id1: id1, mesh_id2: id2 }, stats, allData, d3Data, initTableData)
  const navigateTo = (url: string) => {
    window.open(url)
  }
</script>

<style lang="less" scoped>
  .comparisons-detail-page {
    .info {
      background: #f5f5f5;
      padding: 15px;
      margin-bottom: 20px;
      color: #666;
    }
    dd {
      display: list-item;
      margin-inline-start: 3em;
      dd {
        list-style: circle;
      }
    }
    .svg-plot {
      border: 1px solid #ccc;
      border-radius: 2px;
      overflow-x: auto;
      border-top: 0;
    }
  }
</style>
