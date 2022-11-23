<template>
  <div class="project-detail-page">
    <a-anchor class="catalogue" @click="handleAnchorClick" :target-offset="80">
      <a-anchor-link :href="'#' + path + '#overview'" title="Overview" />
      <a-anchor-link :href="'#' + path + '#associated-runs'" title="Associated runs" />
      <a-anchor-link :href="'#' + path + '#analysis'" title="In-depth analysis">
        <template v-if="project.iscurated > 0">
          <a-anchor-link :href="'#' + path + '#table-view'" title="Table view" />
          <a-anchor-link :href="'#' + path + '#barplot-view'" title="Barplot view" />
          <a-anchor-link :href="'#' + path + '#samples'" title="Samples" />
        </template>
      </a-anchor-link>
    </a-anchor>
    <div class="content">
      <h1>
        Project
        <my-link is-external :to="`https://www.ncbi.nlm.nih.gov/bioproject/${project.project_id}`">
          {{ project.project_id }}
        </my-link>
        <template v-if="project.iscurated > 0">
          &nbsp;
          <my-link :show-icon="false" :to="'#' + path + '#analysis'">
            <i class="iconfont icon-gou"></i>
          </my-link>
        </template>
      </h1>
      <h2 class="title" :id="`${path}#overview`">Overview</h2>
      <ul>
        <li>
          <span class="font-bold">Project ID</span>:
          <my-link
            is-external
            :to="`https://www.ncbi.nlm.nih.gov/bioproject/${project.project_id}`"
          >
            {{ project.project_id }}
          </my-link>
        </li>
        <li>
          <span class="font-bold">Project description</span>:
          {{ project.Original_Project_description }}
        </li>
        <li>
          <dl>
            <dt>
              <span class="font-bold">Total number of runs</span>:
              <span class="text-red-800 italic font-bold">{{
                project.samples_per_project?.toLocaleString()
              }}</span>
            </dt>
            <dd>
              <span class="font-bold">nr. of processed runs</span>:
              <span class="text-red-800 italic font-bold">
                {{ project.loaded_samples?.toLocaleString() }}
              </span>
              ({{ project.processed_runs_pct?.toFixed(2) }}%)
            </dd>
            <dd>
              <span class="font-bold">nr. of runs with abundance information</span>:
              <span class="text-red-800 italic font-bold">
                {{ project.valid_runs?.toLocaleString() }}
              </span>
              ({{ project.valid_runs_pct?.toFixed(2) }}%)
            </dd>
            <dd>
              <span class="font-bold">nr. of failed runs</span>:
              <span class="text-red-800 italic font-bold">
                {{ project.failed_runs?.toLocaleString() }}
              </span>
              ({{ project.failed_runs_pct?.toFixed(2) }}%)
            </dd>
          </dl>
          <span class="font-bold"></span>
        </li>
        <li>
          <dl>
            <dt> <span class="font-bold">Associated phenotypes</span>: </dt>
            <dd v-for="disease in project.diseases?.split(',')" :key="disease">
              <my-link :to="`/phenotypes/${disease}`">{{ diseaseMap[disease] }}</my-link>
              <my-link is-external :to="`https://meshb.nlm.nih.gov/record/ui?ui=${disease}`" />
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt> <span class="font-bold">Related publications</span>: </dt>
            <dd
              v-for="publican in project.Related_Publications?.toString()?.split(',')"
              :key="publican"
            >
              <my-link is-external :to="`https://pubmed.ncbi.nlm.nih.gov/${publican}/`">
                {{ publican }}
              </my-link>
            </dd>
          </dl>
        </li>
      </ul>
      <h2 class="title" :id="`${path}#associated-runs`">Associated runs</h2>
      <p>
        Meta data are available for in total
        <span class="text-red-800 italic font-bold">
          {{ project.samples_per_project?.toLocaleString() }}
        </span>
        runs (samples);
        <my-link
          is-external
          :show-icon="false"
          :to="`https://gmrepo.humangut.info/Downloads/RunsByProjectID/all_runs_in_project_${project.project_id}.tsv.gz`"
        >
          download all associated runs as tsv <el-icon> <Download /> </el-icon> </my-link
        >.
        <my-link
          is-external
          :show-icon="false"
          :to="`https://gmrepo.humangut.info/Downloads/RunsByProjectID/all_unique_run_ids_in_project_${project.project_id}.tsv.gz`"
        >
          Download a list of unqiue IDs (and only unique IDs) of current project as tsv
          <el-icon> <Download /> </el-icon>
        </my-link>
      </p>
      <base-table
        @pagination-change="changeRunPage"
        :table-data="runTable.data"
        :table-head="runTableHead"
        :total="runTable.total"
        :loading="loading"
        :cell-class-name="setQcStatusBg"
        :default-sort="{ prop: 'QCStatus', order: 'descending' }"
      >
        <template #rid="{ row }">
          <my-link :to="`/data/run/${row['run_id']}`">{{ row['run_id'] }}</my-link>
          <my-link
            :to="`https://www.ncbi.nlm.nih.gov/Traces/sra?run=${row['run_id']}`"
            is-external
          />
        </template>
        <template #location="{ row }">
          {{ row.country }}
          <span v-if="row.longitude"
            >( longitude: {{ row.longitude?.toFixed(2) }}, latitude:
            {{ row.latitude?.toFixed(2) }} )</span
          >
        </template>
        <template #phenotype="{ row }">
          <ul>
            <li
              style="margin-inline-start: 0"
              v-for="item in JSON.parse(row.phenotypes)"
              :key="item.disease"
            >
              <my-link :to="`/phenotypes/${item.disease}`">{{ item.term }}</my-link
              >&nbsp;
              <my-link
                :to="`https://meshb.nlm.nih.gov/record/ui?ui=${item.disease}`"
                is-external
                :show-icon="false"
                ><i class="iconfont icon-share"></i
              ></my-link>
            </li>
          </ul>
        </template>
      </base-table>
      <dl class="info mt-20px">
        <dt>
          <el-icon><InfoFilled /></el-icon>Note:
        </dt>
        <dd>
          <dl>
            <dt>
              <span class="font-bold">QCStatus</span>
              * column has three possible values:
            </dt>
            <dd class="bg-green-100/30">1: QC ok and data loaded into our database,</dd>
            <dd class="bg-red-100/30">
              0: QC
              <span class="text-red-500">NOT</span>
              ok and data not loaded into out database,
            </dd>
            <dd>(empty): data yet to be loaded to our database.</dd>
          </dl>
        </dd>
        <dd>
          <span class="font-bold">Async table is used</span>: therefore only partial data were
          downloaded for display.
        </dd>
      </dl>
      <h2 class="title" :id="`${path}#analysis`">In-depth analysis</h2>
      <p class="info" v-if="project.iscurated <= 0">
        <span class="text-red-500 bg-red-100/30">
          In-depth analysis was NOT performed yet for this project;
        </span>
        please come back later or send a request to the authors.
      </p>
      <template v-else>
        <dl class="info">
          <dt> In <logo />, manually curation was performed for selected projects in order to: </dt>
          <dd>select usable runs with clearly defined phenotype,</dd>
          <dd>
            merge multiple runs if they correspond to the same sample, and calcualte taxon
            abundances on per-sample basis instead of per-run basis,
          </dd>
          <dd>group samples according to their corresponding phenotypes, and</dd>
          <dd
            >identify marker taxa between a pair of phenotypes of intersts, e.g. CRC vs. Health.</dd
          >
        </dl>
        <p>
          So far,
          <span class="text-red-800 font-bold italic">{{ stats.markers?.toLocaleString() }}</span>
          <my-link :show-icon="false" to="/taxon/markertaxa">
            marker taxa <i class="iconfont icon-right"></i> </my-link
          >, including
          <span class="text-red-800 font-bold italic">{{
            stats.marker_species?.toLocaleString()
          }}</span>
          marker <span class="font-bold">species</span>
          and
          <span class="text-red-800 font-bold italic">{{
            stats.marker_genus?.toLocaleString()
          }}</span>
          marker <span class="font-bold">genera</span>
          have been identified for
          <span class="text-red-800 font-bold italic">{{
            stats.phenotype_comparisons?.toLocaleString()
          }}</span>
          <my-link :show-icon="false" to="/taxon/markertaxa">
            Phenotype comparison(s) <i class="iconfont icon-right"></i> </my-link
          >, as shown below:
        </p>
        <base-table
          class="mb-10px"
          @pagination-change="comparisonChangePage"
          :table-data="comparisonTable.data"
          :table-head="comparisonTableHead"
          :total="comparisonTable.total"
          :default-sort="{ prop: 'markers', order: 'descending' }"
          @sort-change="comparisonHandleSortChange"
        >
          <template #phenotype1="{ row }">
            <my-link :to="`/phenotypes/${row.phenotype1}`">{{ row.term1 }}</my-link>
            ({{ row.sample_count1 }})
            <my-link is-external :to="`https://meshb.nlm.nih.gov/record/ui?ui=${row.phenotype1}`" />
          </template>
          <template #phenotype2="{ row }">
            <my-link :to="`/phenotypes/${row.phenotype2}`">{{ row.term2 }}</my-link>
            ({{ row.sample_count2 }})
            <my-link is-external :to="`https://meshb.nlm.nih.gov/record/ui?ui=${row.phenotype2}`" />
          </template>
          <template #marker="{ row }">
            {{ row.markers }}
            <my-link
              :show-icon="false"
              :to="`/data/project/${id}/${row.phenotype1}/${row.phenotype2}`"
            >
              view the list
              <i class="iconfont icon-right"></i>
            </my-link>
          </template>
          <template #operation="{ row }">
            <my-link
              :show-icon="false"
              :to="`/phenotypes/comparisons/${row.phenotype1}/${row.phenotype2}`"
            >
              <i class="iconfont icon-right"></i>
            </my-link>
          </template>
        </base-table>
        <p class="mt-20px">
          Please consult the table below for a list of samples used in the comparisons, their
          corresponding runs and groups.
        </p>
        <h3 class="title" :id="`${path}#table-view`">Table view</h3>
        <el-table
          class="base-table mt-20px"
          border
          row-key="id"
          :default-expand-all="expandAll"
          :data="viewTable.data"
          :span-method="mergeColumn"
          :expand-row-keys="expandRowKeys"
          @sort-change="handleViewSortChange"
          :cell-class-name="setQcStatusBg2"
        >
          <el-table-column
            sortable="custom"
            prop="parent"
            :sort-orders="['descending', 'ascending']"
          >
            <template #header>
              <el-select v-model="tableType" style="width: 200px">
                <el-option label="Phenotype comparison" value="comparison" />
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
                  <template v-if="tableType === 'comparison'">
                    <my-link :to="`/species/${row.ncbi_taxon_id}`">
                      {{ row.scientific_name }}
                    </my-link>
                    <my-link :to="`/species/${row.ncbi_taxon_id}`" :show-icon="false">
                      <i class="iconfont icon-star"></i>
                    </my-link>
                    <el-tooltip
                      content="click to view details in a new window/tab"
                      effect="dark"
                      placement="top"
                    >
                      <el-button
                        type="primary"
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
                    <my-link :to="`/phenotypes/${row.phenotype1}`">{{ row.term1 }}</my-link>
                    vs.
                    <my-link :to="`/phenotypes/${row.phenotype2}`">{{ row.term2 }}</my-link>
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
          </el-table-column>
        </el-table>
        <Pagination :total="viewTable.total" @pagination="changeViewPage" />
        <h3 class="title" :id="`${path}#barplot-view`">Barplot view</h3>
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
        <div :class="baseLayer ? 'svg-plot' : ''" ref="svgPlot"></div>
        <div style="text-align: right" v-if="baseLayer">
          <el-button size="small" color="#9c27b0" @click="downloadPng"> SAVE AS PNG </el-button>
          <el-button class="ml-3px" size="small" color="#9c27b0" @click="downloadSvg">
            SAVE AS SVG
          </el-button>
        </div>
        <h3 class="title" :id="`${path}#samples`">Samples</h3>
        <div class="search-wrapper mt-40px">
          <el-checkbox v-model="table.except" label="Except for..." class="pl-10px !mr-10px" />
          <el-input placeholder="Search term" v-model="table.keywords" />
          <el-button type="primary" :icon="Search" class="ml-10px" @click="searchTable">
            Search
          </el-button>
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
                @click="navigateTo('https://meshb.nlm.nih.gov/record/ui?ui=' + row['phenotype'])"
              >
                link to: MeSH db&nbsp;
                <el-icon><Share /></el-icon>
              </el-button>
            </el-tooltip>
          </template>
          <template #run="{ row }">
            {{ row.run_id_cnt }}
            <ul>
              <li v-for="run_id in row.run_ids.split(',')" :key="run_id">
                <my-link :to="`/data/run/${run_id}`">{{ run_id }}</my-link>
                <my-link
                  :to="`https://trace.ncbi.nlm.nih.gov/Traces/index.html?run=${run_id}`"
                  is-external
                />
              </li>
            </ul>
          </template>
        </base-table>
        <my-link :show-icon="false" to="" @click="getSampleTable"
          >Download the above table as tsv <el-icon> <Download /> </el-icon
        ></my-link>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    ResAllmarkers,
    ResAllsamples,
    ResCurationstats,
    ResCurationstatsbyphenotypecomparison,
    ResProject,
    RunChild
  } from '@api/data/project/types'
  import { getAllProjects, getRuns } from '@api/data/project'
  import { Download, InfoFilled, Search, Refresh, Share, View, Hide } from '@element-plus/icons-vue'
  import useLoading from '@/hooks/loading'
  import { useTableTools } from '@/hooks/table'
  import { doPlot } from '@utils/d3/visMarkerSpecies'
  import { download, getSVGString, svgString2Image } from '@/utils'

  const handleAnchorClick = (e: Event) => {
    e.preventDefault()
  }
  const router = useRouter()
  const {
    path,
    params: { id }
  } = router.currentRoute.value

  const diseaseMap = reactive<any>({})
  const project = reactive<ResProject>({})
  const stats = reactive<ResCurationstats>({})

  const runTable = reactive({
    total: 0,
    data: [] as RunChild[],
    page: 1,
    limit: 10
  })
  const runTableHead = [
    {
      label: 'RunID',
      slotName: 'rid',
      prop: 'run_id',
      width: '120',
      sortOrders: ['descending', 'ascending']
    },
    {
      label: 'Experiment type',
      prop: 'experiment_type',
      width: '120',
      sortOrders: ['descending', 'ascending']
    },
    {
      label: 'Instrument',
      prop: 'instrument_model',
      width: '110',
      sortOrders: ['descending', 'ascending']
    },
    {
      label: 'Nr. sequenced reads',
      prop: 'nr_reads_sequenced',
      width: '100',
      sortOrders: ['descending', 'ascending']
    },
    { label: 'Host age', prop: 'host_age', width: '80', sortOrders: ['descending', 'ascending'] },
    { label: 'Gender', prop: 'sex', width: '80', sortOrders: ['descending', 'ascending'] },
    { label: 'BMI', prop: 'BMI', width: '80', sortOrders: ['descending', 'ascending'] },
    {
      label: 'Geo location',
      prop: 'country',
      width: '160',
      slotName: 'location',
      sortOrders: ['descending', 'ascending']
    },
    {
      label: 'Phenotype',
      slotName: 'phenotype',
      width: '95',
      sortable: false
    },
    { label: 'QC Status*', prop: 'QCStatus', sortOrders: ['descending', 'ascending'] }
  ]
  const { loading, toggle } = useLoading()
  const changeRunPage = (data: any) => {
    runTable.page = data.currentPage
    runTable.limit = data.pageSize
    getRunTableData(null)
  }
  const getRunTableData = (total: number | null) => {
    if (!runTable.total && total) runTable.total = total
    toggle()
    getRuns({
      limit: runTable.limit,
      skip: (runTable.page - 1) * runTable.limit,
      project_id: id
    }).then((res) => {
      runTable.data = res
      toggle()
    })
  }
  const setQcStatusBg = ({ row, columnIndex }: any) => {
    if (columnIndex === 9) {
      if (row['QCStatus'] === 1) return 'bg-green-100/30'
      else if (row['QCStatus'] === 0) return 'bg-red-100/30'
      return 'bg-gray-100/30'
    }
  }

  const comparisons = ref<ResCurationstatsbyphenotypecomparison[]>([])
  const comparisonTableHead = [
    {
      label: 'Data type',
      prop: 'experiment_type',
      sortOrders: ['descending', 'ascending'],
      width: '150'
    },
    {
      label: 'Phenotype1 (Nr. samples)',
      prop: 'sample_count1',
      sortOrders: ['descending', 'ascending'],
      slotName: 'phenotype1'
    },
    {
      label: 'Phenotype2 (Nr. samples)',
      prop: 'sample_count2',
      sortOrders: ['descending', 'ascending'],
      slotName: 'phenotype2'
    },
    {
      label: 'Nr. marker taxa',
      prop: 'markers',
      sortOrders: ['descending', 'ascending'],
      slotName: 'marker',
      width: '200'
    },
    {
      slotName: 'operation',
      sortable: false,
      width: '50'
    }
  ]
  const comparisonTable = reactive({
    data: [] as ResCurationstatsbyphenotypecomparison[],
    total: 0,
    limit: 10,
    page: 1,
    keywords: '',
    totalData: [] as ResCurationstatsbyphenotypecomparison[],
    except: false
  })
  const {
    searchTable: comparisonSearchTable,
    changePage: comparisonChangePage,
    handleSortChange: comparisonHandleSortChange
  } = useTableTools<ResCurationstatsbyphenotypecomparison>(comparisons, comparisonTable)

  const viewTable = reactive({
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
      viewTable.data.forEach((item: any) => expandRowKeys.value.push(item.id))
    }
  }
  const columnLabel = ref('Marker taxon')
  const tableType = ref('comparison')
  const markers = ref<ResAllmarkers[]>([])
  const groupByCmp = ref<any[]>([])
  const groupByName = ref<any[]>([])
  const initViewTableData = () => {
    const cmps = new Set()
    const names = new Set()
    markers.value.forEach((m) => {
      cmps.add(m.phenotype_comparison)
      names.add(m.scientific_name)
    })
    const groupCmp: any = {}
    const groupName: any = {}
    cmps.forEach((i: any) => (groupCmp[i] = []))
    names.forEach((i: any) => (groupName[i] = []))
    markers.value.forEach((m, index) => {
      const { phenotype_comparison, scientific_name } = m
      groupCmp[phenotype_comparison].push({
        id: `${phenotype_comparison}_${index}`,
        ...m
      })
      groupName[scientific_name].push({
        id: `${scientific_name}_${index}`,
        ...m
      })
    })
    for (const k in groupCmp) {
      const item = {
        name: k,
        id: k,
        children: groupCmp[k]
      }
      groupByCmp.value.push(item)
    }
    for (const k in groupName) {
      const item = {
        name: k,
        id: k,
        children: groupName[k]
      }
      groupByName.value.push(item)
    }
    viewTable.totalData = groupByCmp.value.slice()
    viewTable.total = viewTable.totalData.length
    getViewTableData()
  }
  watch(tableType, (val) => {
    if (val === 'comparison') {
      columnLabel.value = 'Marker taxon'
    } else {
      columnLabel.value = 'Phenotype comparison'
    }
    viewRefreshSearch()
  })
  const searchForm = reactive({
    rank: '',
    name: ''
  })
  watch(searchForm, () => {
    searchViewTableData()
  })
  const changeViewPage = (data: any) => {
    viewTable.page = data.currentPage
    viewTable.limit = data.pageSize
    getViewTableData()
  }
  const searchViewTableData = () => {
    let totalData
    if (tableType.value === 'comparison') {
      totalData = JSON.parse(JSON.stringify(groupByCmp.value))
    } else {
      totalData = JSON.parse(JSON.stringify(groupByName.value))
    }
    const { rank, name } = searchForm
    for (let i = 0; i < totalData.length; i++) {
      if (rank.length)
        totalData[i].children = totalData[i].children.filter(
          (item: any) => item.taxon_rank_level === rank
        )
      if (name.length)
        totalData[i].children = totalData[i].children.filter((item: any) => {
          if (tableType.value === 'comparison')
            return item.scientific_name?.toLowerCase()?.indexOf(name.toLowerCase()) !== -1
          else return item.phenotype_comparison?.toLowerCase()?.indexOf(name.toLowerCase()) !== -1
        })
    }
    viewTable.page = 1
    viewTable.total = totalData.length
    viewTable.totalData = totalData
    getViewTableData()
  }
  const getViewTableData = () => {
    viewTable.data = []
    viewTable.data.push(
      ...viewTable.totalData.slice(
        (viewTable.page - 1) * viewTable.limit,
        viewTable.page * viewTable.limit
      )
    )
  }
  const viewRefreshSearch = () => {
    searchForm.name = ''
    searchForm.rank = ''
    searchViewTableData()
  }
  const mergeColumn = ({ row, columnIndex }: any) => {
    if (row.children) {
      if (columnIndex === 0) return [1, 3]
      else if (columnIndex === 1) return [0, 0]
      else if (columnIndex === 2) return [0, 0]
    }
  }
  const handleViewSortChange = ({ prop, order }: any) => {
    if (prop === null)
      viewTable.totalData =
        tableType.value === 'comparison' ? groupByCmp.value.slice() : groupByName.value.slice()
    else if (prop === 'parent') {
      if (order === 'descending')
        viewTable.totalData.sort((a: any, b: any) => (b.name > a.name ? 1 : -1))
      else if (order === 'ascending')
        viewTable.totalData.sort((a: any, b: any) => (a.name > b.name ? 1 : -1))
    } else {
      for (let i = 0; i < viewTable.totalData.length; i++) {
        viewTable.totalData[i].children.sort((a: any, b: any) => {
          if (order === 'descending') return b[prop] > a[prop] ? 1 : -1
          if (order === 'ascending') return a[prop] > b[prop] ? 1 : -1
        })
      }
    }
    getViewTableData()
  }
  const setQcStatusBg2 = ({ row, columnIndex }: any) => {
    if (columnIndex === 2) {
      if (row['LDA'] < 0) return 'bg-green-100/30'
      else if (row['LDA'] > 0) return 'bg-red-100/30'
      return 'bg-gray-100/30'
    }
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
  const table = reactive({
    total: 0,
    page: 1,
    limit: 10,
    keywords: '',
    except: false,
    data: [] as ResAllsamples[],
    totalData: [] as ResAllsamples[]
  })
  const tableHead = [
    {
      label: 'Sample UID',
      prop: 'sample_uid',
      sortOrders: ['descending', 'ascending'],
      slotName: 'uid',
      width: '200'
    },
    {
      label: 'Phenotype',
      prop: 'phenotype_term',
      sortOrders: ['descending', 'ascending'],
      slotName: 'phenotype'
    },
    {
      label: 'Sample ID',
      prop: 'sample_id',
      sortOrders: ['descending', 'ascending'],
      width: '150'
    },
    {
      label: 'Nr. run(s)',
      prop: 'run_id_cnt',
      sortOrders: ['descending', 'ascending'],
      slotName: 'run',
      width: '200'
    }
  ]
  const { handleSortChange, changePage, refreshSearch, searchTable } = useTableTools<ResAllsamples>(
    samples,
    table
  )
  const navigateTo = (url: string) => {
    window.open(url)
  }
  const getSampleTable = () => {
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

    for (let l = 0; l < samples.value.length; l++) {
      const row = samples.value[l]
      contents +=
        [
          project.project_id,
          row?.sample_id,
          row.sample_uid,
          row.phenotype,
          row.phenotype_term,
          row.run_id_cnt,
          row.run_ids
        ].join('\t') + '\n'
    }

    const fileData = new Blob([contents], {
      type: 'text/plain;charset=utf-8'
    })
    const filename = 'samples_in_curated_project_' + project.project_id + '.txt'
    download(fileData, filename)
  }

  getAllProjects(
    id,
    diseaseMap,
    project,
    stats,
    comparisons,
    markers,
    d3Data,
    samples,
    getRunTableData,
    comparisonSearchTable,
    initViewTableData,
    searchTable
  )
</script>

<style lang="less" scoped>
  .project-detail-page {
    /deep/ .ant-anchor-link-title {
      white-space: normal;
    }
    .title {
      margin-top: 40px;
      font-weight: 400;
    }
    ul {
      list-style: disc;
    }
    dd,
    li {
      display: list-item;
      margin-inline-start: 3em;
      dd {
        list-style: circle;
      }
    }
    .catalogue {
      position: fixed;
      width: 200px;
      top: 80px;
    }
    .content {
      padding-left: 220px;
      .info {
        background: #f5f5f5;
        padding: 15px;
        margin-bottom: 20px;
        color: #666;
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
  }
</style>
