<template>
  <div class="samples-runs">
    <div class="query-pane bg-blue-100/40">
      <sample-selector
        :phenotype="phenotype"
        :search="handleSearch"
        :fields="fields"
        :initValue="initValue"
        :initValue1="initValue1"
        :initValue2="initValue2"
        :initValue3="initValue3"
      />
    </div>
    <template v-if="table.total !== 0">
      <p class="mt-40px"
        >In total
        <span class="text-red-900 font-bold italic">{{ table.total.toLocaleString() }}</span>
        entries obtained from your query.</p
      >
      <base-table
        @pagination-change="changePage"
        :table-data="table.data"
        :table-head="tableHead"
        :total="table.total"
        :loading="loading"
        :cell-class-name="setQcStatusBg"
        :default-sort="{ prop: 'QCStatus', order: 'descending' }"
      >
        <template #projectId="{ row }">
          <my-link :to="`/data/project/${row['project_id']}`"> {{ row['project_id'] }} </my-link
          >&thinsp;
          <my-link
            :to="`https://www.ncbi.nlm.nih.gov/bioproject/${row['project_id']}`"
            is-external
          />
        </template>
        <template #runId="{ row }">
          <my-link :to="`/data/run/${row['run_id']}`"> {{ row['project_id'] }} </my-link>&thinsp;
          <my-link
            :to="`https://trace.ncbi.nlm.nih.gov/Traces/sra/?run=${row['run_id']}`"
            is-external
          />
        </template>
        <template #disease="{ row }">
          <my-link :to="`/phenotypes/${row['disease']}`"> {{ row['disease'] }} </my-link>&thinsp;
          <my-link :to="`https://meshb.nlm.nih.gov/record/ui?ui=${row['disease']}`" is-external />
        </template>
      </base-table>
      <div class="mt-24px">
        <el-button type="success" @click="handleDownloadSelectedRunIDs">
          DOWNLOAD DATA AS CSV&nbsp;<el-icon><Download /></el-icon>
        </el-button>
        <el-button type="primary" @click="handleDownloadUniqueIDs">
          DOWNLOAD UNIQUE RUN IDS OF THE SEARCH RESULTS&nbsp;<el-icon><Download /></el-icon>
        </el-button>
      </div>
      <dl class="info !p-25px">
        <dt
          ><el-icon><InfoFilled /></el-icon> Note:</dt
        >
        <dd class="first-item">
          <dl>
            <dt class="title"
              ><span class="font-bold">QC Status</span> * column has three possible values</dt
            >
            <dd class="second-item bg-green-100/30">1: QC ok and data loaded into our database,</dd>
            <dd class="second-item bg-red-100/30"
              >0: QC NOT ok and data not loaded into out database,</dd
            >
            <dd class="second-item">(empty): data yet to be loaded to our database.</dd>
          </dl>
        </dd>
        <dd class="first-item"
          ><span class="font-bold">Async table is used</span>: therefore only partial data were
          downloaded for display.</dd
        >
        <dd class="first-item"
          ><span class="font-bold">About the number of runs</span>: in a subset of runs, one run can
          be associated with multiple phenotypes. Therefore these runs could appear multiple times
          in the above table if a user did not restrict his/her search to a specific phenotype, and
          the number of retrieved runs could be larger than it should be.</dd
        >
      </dl>
    </template>
  </div>
</template>
<script setup>
  import { applyReactInVue } from 'veaury'
  import useHomeData from '../../../../hooks/homeData'
  import QueryBuilder from '../Selector/QueryBuilder.jsx'
  import {
    downloadSelectedRunIDs,
    downloadUniqueIDs,
    searchRuns,
    searchRunsSum
  } from '../../../../api/home'
  import {
    fields,
    initValue1,
    initValue3,
    initValue2,
    initValue
  } from '../Selector/SampleRunSelectorConfig'
  import { Download, InfoFilled } from '@element-plus/icons-vue'
  import { download } from '../../../../utils'
  import useLoading from '../../../../hooks/loading'

  const SampleSelector = applyReactInVue(QueryBuilder)
  const { phenotype } = useHomeData()

  const { loading, toggle } = useLoading()
  const tableHead = [
    { label: 'ProjectID', prop: 'project_id', slotName: 'projectId' },
    { label: 'RunID', prop: 'run_id', slotName: 'runId' },
    { label: 'Phenotype', prop: 'disease', slotName: 'disease' },
    { label: 'Experiment type', prop: 'experiment_type' },
    { label: 'Host age', prop: 'host_age', width: '90' },
    { label: 'Gender', prop: 'sex', width: '80' },
    { label: 'BMI', prop: 'BMI', width: '60' },
    { label: 'Geo location', prop: 'country' },
    { label: 'Nr. of associated phenotype(s)', prop: 'nr_diseases', width: '150' },
    { label: 'QC Status*', prop: 'QCStatus' }
  ]
  const table = reactive({
    total: 0,
    data: [],
    page: 1,
    limit: 10,
    sql: ''
  })
  const handleSearch = async (sql) => {
    const runsSum = await searchRunsSum(sql)
    table.total = runsSum.total
    table.page = 1
    table.sql = sql
    getTableData()
  }
  const changePage = (data) => {
    table.page = data.currentPage
    table.limit = data.pageSize
    getTableData()
  }
  const getTableData = () => {
    toggle()
    searchRuns({ sql: table.sql, limit: table.limit, skip: (table.page - 1) * table.limit }).then(
      (res) => {
        table.data = res
        toggle()
      }
    )
  }

  const handleDownloadSelectedRunIDs = async () => {
    const res = await downloadSelectedRunIDs(table.sql)
    let contents =
      `#user selection logic: ${table.sql}\n` +
      `#run count: ${table.total}\n` +
      `${[
        'Run ID',
        'Project ID',
        'Experiment type',
        'Nr. reads sequenced',
        'Country',
        'Sex',
        'Host age',
        'BMI',
        'Recent antibiotics use',
        'Disease MESH ID',
        'Disease name',
        'QC status',
        'Nr. associated phenotypes'
      ].join('\t')}\n`
    res.forEach((item) => {
      const arr = []
      for (const k in item) arr.push(item[k])
      contents += arr.join('\t') + '\n'
    })
    const data = new Blob([contents], {
      type: 'text/plain;charset=utf-8'
    })
    const fileName = 'user_selected_run_list_' + Date.now().toString() + '.txt'
    download(data, fileName)
  }

  const handleDownloadUniqueIDs = async () => {
    const res = await downloadUniqueIDs(table.sql)
    let contents = ''
    res.forEach((item) => {
      const arr = []
      for (const k in item) arr.push(item[k])
      contents += arr.join('\t') + '\n'
    })
    const data = new Blob([contents], {
      type: 'text/plain;charset=utf-8'
    })
    const fileName = 'user_selected_unique_run_ids_' + Date.now().toString() + '.txt'
    download(data, fileName)
  }

  const setQcStatusBg = ({ row, columnIndex }) => {
    if (columnIndex === 9) {
      if (row['QCStatus'] === 1) return 'bg-green-100/30'
      else if (row['QCStatus'] === 0) return 'bg-red-100/30'
    }
    return ''
  }
</script>

<style lang="less" scoped>
  .samples-runs {
    .query-pane {
      margin: 20px 0;
      border-left: 3px solid #bce8f1;
    }
    .info {
      background: #f5f5f5;
      list-style-type: disc;
      .first-item {
        display: list-item;
        margin-inline-start: 3em;
        .second-item {
          display: list-item;
          margin-inline-start: 3em;
          list-style-type: circle;
        }
      }
    }
  }
</style>
