<template>
  <div class="project-comparison-detail-page">
    <h1>
      Marker taxa of
      <my-link :to="`/phenotypes/${disease1}`">{{ metadata.phenotype1_term }}</my-link>
      vs.
      <my-link :to="`/phenotypes/${disease2}`">{{ metadata.phenotype2_term }}</my-link>
      in project
      <my-link :to="`https://www.ncbi.nlm.nih.gov/bioproject/${pid}`" is-external>
        {{ pid }}
      </my-link>
      <my-link :to="`/data/project/${pid}`" />
      <my-link v-if="metadata.iscurated > 0" :show-icon="false" to="">
        <i class="iconfont icon-gou"></i>
      </my-link>
    </h1>
    <div class="info">
      <p>
        In total
        <span class="text-red-800 italic font-bold">{{ stats.markers }}</span>
        <my-link :show-icon="false" to="/taxon/markertaxa">
          marker taxa <i class="iconfont icon-right"></i> </my-link
        >, including
        <span class="text-red-800 italic font-bold">{{ stats.marker_species }}</span>
        marker <span class="font-bold">species</span>
        and
        <span class="text-red-800 italic font-bold">{{ stats.marker_genus }}</span>
        marker <span class="font-bold">genera</span>
        have been identified between:
      </p>
      <ul>
        <li>
          <my-link :to="`/phenotypes/${disease1}`">{{ metadata.phenotype1_term }}</my-link>
          <el-button
            type="primary"
            size="small"
            style="margin-left: 5px"
            @click="navigateTo('https://meshb.nlm.nih.gov/record/ui?ui=' + disease1)"
          >
            link to: MESH db <el-icon><Share /></el-icon>
          </el-button>
          ( {{ stats.sample_count1 }} samples)
        </li>
        <li>
          <my-link :to="`/phenotypes/${disease2}`">{{ metadata.phenotype2_term }}</my-link>
          <el-button
            type="primary"
            size="small"
            style="margin-left: 5px"
            @click="navigateTo('https://meshb.nlm.nih.gov/record/ui?ui=' + disease2)"
          >
            link to: MESH db <el-icon><Share /></el-icon>
          </el-button>
          ( {{ stats.sample_count2 }} samples)
        </li>
      </ul>
      <p class="mt-10px"
        >Please consult the table below for a list of samples used in the comparisons, their
        corresponding runs and groups.</p
      >
      <p>
        <el-icon><InfoFilled /></el-icon> Note this page is for
        <my-link :show-icon="false" to="/data/curatedprojects">
          curated projects <i class="iconfont icon-right"></i>
        </my-link>
        only.
      </p>
    </div>
    <h3 class="!mt-40px">Table view</h3>
    <base-table
      class="mb-10px"
      @pagination-change="markersChangePage"
      :table-data="markersTable.data"
      :table-head="markersTableHead"
      :total="markersTable.total"
      :default-sort="{ prop: 'LDA', order: 'descending' }"
      @sort-change="markersHandleSortChange"
      :cell-class-name="setLDABg"
    >
      <template #taxon="{ row }">
        <my-link :show-icon="false" :to="`/taxon/${row.ncbi_taxon_id}`">
          <span class="italic">{{ row.scientific_name }}</span> <i class="iconfont icon-star"></i>
        </my-link>
        <el-tooltip
          content="click to view details in a new window/tab"
          effect="dark"
          placement="top"
        >
          <el-button
            color="#9c27b0"
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
        <el-tooltip
          content="click to view details on abundance and prevalence of this speices in all its associated phenotypes in a new window/tab"
          effect="dark"
          placement="top"
        >
          <el-button
            type="primary"
            size="small"
            style="float: right; margin-right: 5px"
            @click="navigateTo(`#/species/${row.ncbi_taxon_id}`)"
          >
            link to: Species&nbsp;
            <i class="iconfont icon-right"></i>
          </el-button>
        </el-tooltip>
      </template>
      <template #scientific_nameHeader="{ label }">
        {{ label }}
        <el-input
          v-model="searchForm.name"
          style="width: 200px; display: inline"
          @click.stop
          size="small"
        />
      </template>
      <template #taxon_rank_levelHeader="{ label }">
        {{ label }}
        <el-select v-model="searchForm.rank" style="width: 80px" size="small">
          <el-option
            v-for="item in ranks"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <template #lda="{ row }">{{ row.LDA?.toFixed(3) }}</template>
    </base-table>
    <my-link :show-icon="false" to="" @click="downloadNgTableMarkers">
      Download the above table as tsv
      <el-icon> <Download /> </el-icon>
    </my-link>
    <div class="info">
      Marker taxa with <span class="bg-green-100/30">LDA &lt; 0</span>
      are
      <my-link :to="`/phenotypes/${disease1}`">{{ metadata.phenotype1_term }}</my-link>
      enriched, while those with
      <span class="bg-red-100/30">LDA &gt; 0</span> are
      <my-link :to="`/phenotypes/${disease2}`">{{ metadata.phenotype2_term }}</my-link>
      enriched.
    </div>
    <h3 class="!mt-40px">Barplot view</h3>
    <span class="font-bold align-bottom"> Markers to show: </span>
    <el-radio-group v-model="d3Data.markertype" size="small">
      <el-radio-button label="" :disabled="stats.markers <= 0">ALL</el-radio-button>
      <el-radio-button label="species" :disabled="stats.marker_species <= 0">
        SPECIES
      </el-radio-button>
      <el-radio-button label="genus" :disabled="stats.marker_genus <= 0">GENUS</el-radio-button>
    </el-radio-group>
    <div :class="baseLayer ? 'svg-plot' : ''" ref="svgPlot"></div>
    <div style="text-align: right" v-if="baseLayer">
      <el-button size="small" color="#9c27b0" @click="downloadPng"> SAVE AS PNG </el-button>
      <el-button class="ml-3px" size="small" color="#9c27b0" @click="downloadSvg">
        SAVE AS SVG
      </el-button>
    </div>
    <h3 class="!mt-40px">Boxplot view</h3>
    <div class="info">
      <p>
        <span class="bg-red-100/30 text-red-500">Boxplot view</span>
        here plots relative abundances of all markers in the two sample groups.
      </p>
      <p>
        Users may drag the right-bottom cornor to resize the plot. It may take a while to re-load
        the plot if it contains a lot of marker taxa.
      </p>
    </div>
    <h3 class="!mt-40px">Samples</h3>
    <div class="info">
      In total
      <span class="text-red-800 font-bold italic">{{ samples.length.toLocaleString() }}</span>
      samples were curated in this project for the two phenotypes; one sample may correspond to
      multiple runs.
    </div>
    <div class="search-wrapper mt-8">
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
      :default-sort="{ prop: 'run_id_cnt', order: 'descending' }"
      @sort-change="handleSortChange"
    >
      <template #uid="{ row }">
        <my-link :to="`/data/curatedsample/${row.sample_uid}`">{{ row.sample_uid }}</my-link>
      </template>
      <template #phenotype="{ row }">
        <my-link :to="`/phenotypes/${row.phenotype}`">{{ row.phenotype_term }}</my-link>
        <el-tooltip
          content="view details of this disease at NCBI MeSH website in a new window/tab"
          effect="dark"
          placement="top"
        >
          <el-button
            type="primary"
            size="small"
            style="float: right"
            @click="navigateTo(`https://meshb.nlm.nih.gov/record/ui?ui=${row.phenotype}`)"
          >
            link to: MeSH db&nbsp;
            <el-icon><Share /></el-icon>
          </el-button>
        </el-tooltip>
      </template>
      <template #runs="{ row }">
        <dl>
          <dt>{{ row.run_id_cnt }}</dt>
          <dd
            v-for="run_id in row.run_ids.split(',')"
            :key="run_id"
            style="display: list-item; margin-inline-start: 3em"
          >
            <my-link :to="`/data/run/${run_id}`">{{ run_id }}</my-link>
            <my-link :to="`https://trace.ncbi.nlm.nih.gov/Traces/sra/?run=${run_id}`" is-external />
          </dd>
        </dl>
      </template>
    </base-table>
    <my-link :show-icon="false" to="" @click="downloadNgTableAllSamples">
      Download the above table as tsv
      <el-icon> <Download /> </el-icon>
    </my-link>
  </div>
</template>

<script lang="ts" setup>
  import { getProjectDetailOnComparison } from '@api/data/project/comparisonDetail'
  import {
    ResAllmarkers,
    ResAllsamples,
    ResCurationstats,
    ResMetadata
  } from '@api/data/project/comparisonDetail/types'
  import { Share, InfoFilled, Download, Search, Refresh } from '@element-plus/icons-vue'
  import { useTableTools } from '@/hooks/table'
  import { download, getSVGString, svgString2Image } from '@/utils'
  import { doPlot } from '@utils/d3/visMarkerSpecies'

  const router = useRouter()
  const {
    params: { pid, disease1, disease2 }
  } = router.currentRoute.value

  const stats = reactive<ResCurationstats>({})
  const metadata = reactive<ResMetadata>({})

  const markers = ref<ResAllmarkers[]>([])
  const markersTableHead = [
    { label: 'Marker taxon', prop: 'scientific_name', slotName: 'taxon', customHeader: true },
    {
      label: 'Taxonomic rank',
      prop: 'taxon_rank_level',
      width: '250',
      customHeader: true
    },
    { label: 'LDA score', prop: 'LDA', width: '250', slotName: 'lda' }
  ]
  const markersTable = reactive({
    data: [] as ResAllmarkers[],
    total: 0,
    page: 1,
    limit: 10,
    keywords: '',
    totalData: [] as ResAllmarkers[],
    except: false
  })
  const {
    searchTable: markersSearchTable,
    changePage: markersChangePage,
    handleSortChange: markersHandleSortChange,
    getTableData: getMarkersTableData
  } = useTableTools<ResAllmarkers>(markers, markersTable)
  const setLDABg = ({ row, columnIndex }: any) => {
    if (columnIndex === 2) {
      if (row['LDA'] < 0) return 'bg-green-100/30'
      else if (row['LDA'] > 0) return 'bg-red-100/30'
      return 'bg-gray-100/30'
    }
  }
  const ranks = ref([
    { label: 'All', value: '' },
    { label: 'Species', value: 'species' },
    { label: 'Genus', value: 'genus' }
  ])
  const searchForm = reactive({
    rank: '',
    name: ''
  })
  watch(searchForm, () => {
    const { rank, name } = searchForm
    markersTable.totalData = markers.value.slice()
    if (rank.length) {
      markersTable.totalData = markersTable.totalData.filter(
        (item) => item.taxon_rank_level === rank
      )
    }
    if (name.length) {
      markersTable.totalData = markersTable.totalData.filter(
        (item) => item.scientific_name?.toLowerCase()?.indexOf(name.toLowerCase()) !== -1
      )
    }
    markersTable.page = 1
    markersTable.total = markersTable.totalData.length
    getMarkersTableData()
  })
  const downloadNgTableMarkers = () => {
    let contents =
      [
        'project id',
        'phenotype1',
        'term1',
        'phenotype2',
        'term2',
        'scientific name',
        'ncbi taxon id',
        'taxonomic rank',
        'LDA'
      ].join('\t') + '\n'

    for (var l = 0; l < markers.value.length; l++) {
      var row = markers.value[l]
      contents +=
        [
          metadata.project_id,
          row.phenotype1,
          row.term1,
          row.phenotype2,
          row.term2,
          row.scientific_name,
          row.ncbi_taxon_id,
          row.taxon_rank_level,
          row.LDA
        ].join('\t') + '\n'
    }
    const data = new Blob([contents], {
      type: 'text/plain;charset=utf-8'
    })
    const filename =
      'marker_taxa_in_curated_project_' +
      metadata.project_id +
      '_between_' +
      metadata.phenotype1 +
      '_' +
      metadata.phenotype2 +
      '.txt'
    download(data, filename)
  }

  const d3Data = reactive<any>({
    datatype: 'project-centric-view',
    data: {},
    markertype: ''
  })
  const svgPlot = ref()
  const baseLayer = ref()
  watch(
    () => d3Data.markertype,
    () => {
      baseLayer.value = doPlot(d3Data, svgPlot.value)
    }
  )
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

  const samples = ref<ResAllsamples[]>([])
  const tableHead = [
    {
      label: 'Sample UID',
      slotName: 'uid',
      prop: 'sample_uid',
      sortOrders: ['descending', 'ascending'],
      sortable: 'custom'
    },
    {
      label: 'Phenotype',
      prop: 'phenotype_term',
      slotName: 'phenotype',
      sortOrders: ['descending', 'ascending'],
      sortable: 'custom'
    },
    {
      label: 'Sample ID',
      prop: 'sample_id',
      width: '200',
      sortOrders: ['descending', 'ascending'],
      sortable: 'custom'
    },
    {
      label: 'Nr. run(s)',
      prop: 'run_id_cnt',
      slotName: 'runs',
      width: '200',
      sortOrders: ['descending', 'ascending'],
      sortable: 'custom'
    }
  ]
  const table = reactive({
    data: [] as ResAllsamples[],
    total: 0,
    page: 1,
    limit: 10,
    keywords: '',
    totalData: [] as ResAllsamples[],
    except: false
  })
  const { searchTable, refreshSearch, changePage, handleSortChange } = useTableTools<ResAllsamples>(
    samples,
    table
  )
  const downloadNgTableAllSamples = () => {
    let contents =
      [
        'project id',
        'sample id',
        'sample_uid',
        'phenotype',
        'phenotype term',
        'run count',
        'run ids'
      ].join('\t') + '\n'

    for (var l = 0; l < samples.value.length; l++) {
      const row = samples.value[l]
      contents +=
        [
          pid,
          row.sample_id,
          row.sample_uid,
          row.phenotype,
          row.phenotype_term,
          row.run_id_cnt,
          row.run_ids
        ].join('\t') + '\n'
    }
    const data = new Blob([contents], {
      type: 'text/plain;charset=utf-8'
    })
    const filename = 'samples_in_curated_project_' + pid + '.txt'
    download(data, filename)
  }

  getProjectDetailOnComparison(
    {
      ncbi_project_id: pid,
      phenotype1: disease1,
      phenotype2: disease2
    },
    stats,
    metadata,
    markers,
    d3Data,
    samples,
    markersSearchTable,
    searchTable
  )
  const navigateTo = (url: string) => {
    window.open(url)
  }
</script>

<style scoped lang="less">
  .project-comparison-detail-page {
    .info {
      background: #f5f5f5;
      padding: 15px;
      margin-bottom: 20px;
      color: #666;
      list-style-type: disc;
    }
    ul {
      list-style: disc;
      dd,
      li {
        display: list-item;
        margin-inline-start: 3em;
        dd {
          list-style: circle;
        }
      }
    }
    .svg-plot {
      border: 1px solid #ccc;
      border-radius: 2px;
    }
    .search-wrapper {
      display: flex;
      .el-input {
        flex: 1;
      }
    }
  }
</style>
