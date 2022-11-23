<template>
  <div class="projects-runs-page">
    <h1>Projects and runs</h1>
    <dl class="info mt-20px !py-30px">
      <dt class="font-bold">Data summary:</dt>
      <dd>
        <dl>
          <dt
            ><span class="font-bold">Meta data</span> for in total
            <span class="text-red-800 font-bold italic">{{
              stats.project_count_with_valid_phenotype_data?.toLocaleString()
            }}</span>
            projects, containing
            <span class="text-red-800 font-bold italic">{{
              stats.all_runs_count?.toLocaleString()
            }}</span>
            runs (samples) are available in
            <logo class="font-bold" />
            . These runs (samples) including
          </dt>
          <dd v-for="run in allRuns" :key="run.experiment_type"
            ><span class="text-red-800 font-bold italic">{{
              run.all_runs_count.toLocaleString()
            }}</span>
            that are <span class="font-bold">{{ run.experiment_type }}</span></dd
          >
        </dl>
      </dd>
      <dd
        >Among which, raw data have been processed for in total
        <span class="text-red-800 font-bold italic">{{
          stats.processed_runs_count?.toLocaleString()
        }}</span>
        runs (samples), belonging to
        <span class="text-red-800 font-bold italic">{{
          stats.processed_project_count?.toLocaleString()
        }}</span>
        projects.
      </dd>
      <dd
        >Among which, microbe abundance data are available for in total
        <span class="text-red-800 font-bold italic">{{
          stats.loaded_runs_count?.toLocaleString()
        }}</span>
        runs (samples), belonging to
        <span class="text-red-800 font-bold italic">{{
          stats.loaded_projects_count?.toLocaleString()
        }}</span>
        projects.
      </dd>
      <dd
        >In total
        <span class="text-red-800 font-bold italic">{{
          stats.failed_runs_count?.toLocaleString()
        }}</span>
        runs (samples), belonging to
        <span class="text-red-800 font-bold italic">{{
          stats.failed_project_count?.toLocaleString()
        }}</span>
        projects <span class="text-red-500 bg-red-100/30">failed our QC processes.</span></dd
      >
      <dd
        >In addition,
        <logo class="font-bold" />
        also includes information on
        <span class="text-red-800 font-bold italic">{{
          stats.project_count_with_invalid_phenotype_data?.toLocaleString()
        }}</span>
        projects whose raw data were <span class="text-red-500 bg-red-100/30">not processed</span>,
        including in total
        <span class="text-red-800 font-bold italic">{{
          stats.run_count_without_valid_phenotype_data?.toLocaleString()
        }}</span>
        runs/samples, due to various reasons, mostly
        <span class="text-red-500 bg-red-100/30">the lack of phenotype information</span>.
      </dd>
    </dl>
    <h2>Projects</h2>
    <p
      >Meta data are available for in total projects;
      <my-link
        to="https://gmrepo.humangut.info/Downloads/AllSummaryData/all_projects_metadata.tsv.gz"
        is-external
        :show-icon="false"
        >click here to download all projects as tsv
        <el-icon style="vertical-align: text-bottom">
          <Download />
        </el-icon>
      </my-link>
      .
    </p>
    <base-table
      @pagination-change="changePage"
      :table-data="projectTable.data"
      :table-head="projectTableHead"
      :total="projectTable.total"
      :default-sort="{ prop: 'valid_runs', order: 'descending' }"
      @sort-change="handleSortChange"
      :cell-class-name="setPrcStatusBg"
    >
      <template #pid="{ row }">
        <my-link :to="`/data/project/${row['project_id']}`">{{ row['project_id'] }}</my-link>
        <el-tooltip content="click to view it in NCBI BioProject" effect="dark" placement="top">
          <el-button
            type="primary"
            size="small"
            style="float: right"
            @click="navigateTo('https://www.ncbi.nlm.nih.gov/bioproject/' + row['project_id'])"
          >
            NCBI&nbsp;
            <el-icon>
              <Share />
            </el-icon>
          </el-button>
        </el-tooltip>
      </template>
      <template #pOfTotal="{ row }">
        {{ row.valid_runs?.toLocaleString() }}
        ({{ row.Number_of_runs?.toLocaleString() }})
      </template>
      <template #phenotypes="{ row }">
        <ul style="list-style-type: disc; margin-left: 3px">
          <li v-for="disease in row.diseases?.split(',')" :key="disease" style="display: list-item">
            <my-link :to="`/phenotypes/${disease}`">{{ disease2term[disease] }}</my-link
            >&nbsp;
            <my-link
              :to="`https://meshb.nlm.nih.gov/record/ui?ui=${disease}`"
              is-external
              :show-icon="false"
              ><i class="iconfont icon-share"></i
            ></my-link>
          </li>
        </ul>
      </template>
      <template #publicans="{ row }">
        <ul v-if="row.Related_Publications" style="list-style-type: disc; margin-left: 3px">
          <li
            v-for="publican in row.Related_Publications.toString().split(',')"
            style="display: list-item"
            :key="publican"
          >
            <my-link
              :to="`https://pubmed.ncbi.nlm.nih.gov/${publican}/`"
              is-external
              :show-icon="false"
            >
              {{ publican }}
              <i class="iconfont icon-share"></i>
            </my-link>
          </li>
        </ul>
        <span v-else>NA</span>
      </template>
      <template #description="{ row }">
        <el-tooltip :content="row.Original_Project_description" placement="top">
          <p
            style="
              display: -webkit-box;
              text-overflow: ellipsis;
              overflow: hidden;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
            "
            >{{ row.Original_Project_description }}</p
          >
        </el-tooltip>
      </template>
    </base-table>
    <p class="info mt-20px">
      <span class="font-bold">Raw data processed*</span> : In <logo class="font-bold" /> project
      information are also available for
      <span class="text-red-800 font-bold italic">{{
        stats.project_count_with_invalid_phenotype_data?.toLocaleString()
      }}</span>
      projects whose raw data were <span class="text-red-500 bg-red-100/30">not processed</span>,
      correspondin to in total
      <span class="text-red-800 font-bold italic">{{
        stats.run_count_without_valid_phenotype_data?.toLocaleString()
      }}</span>
      runs/samples, due to various reasons, mostly because of
      <span class="text-red-500 bg-red-100/30">the lack of phenotype information</span>; please
      click the project id for details.
    </p>
    <h2>Runs</h2>
    <p
      >Meta data are available for in total,
      <span class="text-red-800 font-bold italic">{{
        stats.all_runs_count?.toLocaleString()
      }}</span>
      runs/samples;
      <my-link
        to="https://gmrepo.humangut.info/Downloads/AllSummaryData/all_runs_metadata.tsv.gz"
        is-external
        :show-icon="false"
        >click here to download all projects as tsv
        <el-icon style="vertical-align: text-bottom">
          <Download />
        </el-icon>
      </my-link>
    </p>
    <base-table
      :table-data="runTable.data"
      :total="stats.all_runs_count"
      :table-head="runTableHead"
      :loading="loading"
      @pagination-change="changeRunPage"
      :cell-class-name="setQcStatusBg"
    >
      <template #pid="{ row }">
        <my-link :to="`/data/project/${row['project_id']}`">{{ row['project_id'] }}</my-link>
        <el-tooltip content="click to view it in NCBI BioProject" effect="dark" placement="top">
          <el-button
            type="primary"
            size="small"
            style="float: right"
            @click="navigateTo('https://www.ncbi.nlm.nih.gov/bioproject/' + row['project_id'])"
          >
            NCBI&nbsp;
            <el-icon>
              <Share />
            </el-icon>
          </el-button>
        </el-tooltip>
      </template>
      <template #rid="{ row }">
        <my-link :to="`/data/run/${row['run_id']}`">{{ row['run_id'] }}</my-link>
        <el-tooltip
          content="click to view it in NCBI SRA(Sequence Read Archive)"
          effect="dark"
          placement="top"
        >
          <el-button
            type="primary"
            size="small"
            style="float: right"
            @click="navigateTo('https://www.ncbi.nlm.nih.gov/Traces/sra?run=' + row['run_id'])"
          >
            NCBI&nbsp;
            <el-icon>
              <Share />
            </el-icon>
          </el-button>
        </el-tooltip>
      </template>
      <template #phenotype="{ row }">
        <my-link :to="`/phenotypes/${row.disease}`">{{ disease2term[row.disease] }}</my-link
        >&nbsp;
        <my-link
          :to="`https://meshb.nlm.nih.gov/record/ui?ui=${row.disease}`"
          is-external
          :show-icon="false"
          ><i class="iconfont icon-share"></i
        ></my-link>
      </template>
    </base-table>
    <dl class="info mt-20px">
      <dt>NOTE:</dt>
      <dd>
        <dl>
          <dt class="font-bold">*QCStatus</dt>
          <dd class="bg-green-100/30">1: QC ok and data loaded into our database,</dd>
          <dd class="bg-red-100/30">0: QC NOT ok and data not loaded into out database,</dd>
          <dd>(empty): data yet to be loaded to our database.</dd>
        </dl>
      </dd>
    </dl>
  </div>
</template>

<script setup lang="ts">
  import { useSaveScrollPosition } from '@/hooks/saveScrollPosition'
  import { Allrunsbyexperimenttype, Disease2term, Project, Stats } from '@api/data/types'
  import { getAllProjectsWithMetadata, getRuns } from '@api/data'
  import { Download, Share } from '@element-plus/icons-vue'
  import { useTableTools } from '@/hooks/table'
  import useLoading from '@/hooks/loading'

  const scrollTop = ref(0)
  useSaveScrollPosition(scrollTop)

  const projectTable = reactive({
    data: [] as Project[],
    total: 0,
    page: 1,
    limit: 10,
    keywords: '',
    except: false,
    totalData: [] as Project[]
  })
  const projectTableHead = [
    {
      label: 'ProjectID',
      slotName: 'pid',
      prop: 'project_id',
      width: '200',
      sortable: 'custom',
      sortOrders: ['descending', 'ascending']
    },
    {
      label: 'Nr. of processed runs (Nr. total runs)',
      slotName: 'pOfTotal',
      prop: 'valid_runs',
      width: '200',
      sortable: 'custom',
      sortOrders: ['descending', 'ascending']
    },
    { label: 'Related phenotype(s)', slotName: 'phenotypes', width: '200', sortable: false },
    { label: 'Related publican(s)', slotName: 'publicans', width: '150', sortable: false },
    { label: 'Description', sortable: false, slotName: 'description' },
    {
      label: 'Raw data processed*',
      prop: 'has_it_been_collected',
      width: '150',
      sortable: 'custom',
      sortOrders: ['descending', 'ascending']
    }
  ]
  const stats = reactive<Stats>({})
  const projects = ref<Project[]>([])
  const allRuns = ref<Allrunsbyexperimenttype[]>([])
  const disease2term = reactive<Disease2term>({})
  const { handleSortChange, changePage, getTableData, searchTable } = useTableTools(
    projects,
    projectTable
  )
  getAllProjectsWithMetadata(projects, allRuns, stats, disease2term, searchTable)
  const setPrcStatusBg = ({ row, columnIndex }: any) => {
    if (columnIndex === 5) {
      if (row.has_it_been_collected === 'Y') return 'bg-green-100/30'
      else if (row.has_it_been_collected === 'N') return 'bg-red-100/30'
    }
    return ''
  }

  const navigateTo = (url: string) => {
    window.open(url)
  }

  const { loading, toggle } = useLoading()
  const runTable = reactive({
    data: [],
    page: 1,
    limit: 10
  })
  const runTableHead = [
    {
      label: 'Project ID',
      slotName: 'pid',
      prop: 'project_id',
      width: '120',
      sortOrders: ['descending', 'ascending']
    },
    {
      label: 'Run ID',
      slotName: 'rid',
      prop: 'run_id',
      width: '120',
      sortOrders: ['descending', 'ascending']
    },
    {
      label: 'Experiment type',
      prop: 'experiment_type',
      width: '150',
      sortOrders: ['descending', 'ascending']
    },
    {
      label: 'Instrument',
      prop: 'instrument_model',
      width: '120',
      sortOrders: ['descending', 'ascending']
    },
    {
      label: 'Nr. sequenced reads',
      prop: 'nr_reads_sequenced',
      width: '160',
      sortOrders: ['descending', 'ascending']
    },
    { label: 'Host age', prop: 'host_age', width: '100', sortOrders: ['descending', 'ascending'] },
    { label: 'Gender', prop: 'sex', width: '80', sortOrders: ['descending', 'ascending'] },
    { label: 'BMI', prop: 'BMI', width: '70', sortOrders: ['descending', 'ascending'] },
    {
      label: 'Geo location',
      prop: 'country',
      width: '120',
      sortOrders: ['descending', 'ascending']
    },
    {
      label: 'Phenotype',
      slotName: 'phenotype',
      width: '120',
      prop: 'disease',
      sortOrders: ['descending', 'ascending']
    },
    { label: 'QC Status*', width: '100', prop: 'QCStatus', sortOrders: ['descending', 'ascending'] }
  ]
  const changeRunPage = (data: any) => {
    runTable.page = data.currentPage
    runTable.limit = data.pageSize
    getRunTableData()
  }
  const getRunTableData = () => {
    toggle()
    getRuns({ limit: runTable.limit, skip: (runTable.page - 1) * runTable.limit }).then((res) => {
      runTable.data = res.runs
      toggle()
    })
  }
  const setQcStatusBg = ({ row, columnIndex }: any) => {
    if (columnIndex === 10) {
      if (row['QCStatus'] === 1) return 'bg-green-100/30'
      else if (row['QCStatus'] === 0) return 'bg-red-100/30'
      return 'bg-gray-100/30'
    }
  }
  getRunTableData()
</script>

<script lang="ts">
  export default {
    // eslint-disable-next-line vue/no-reserved-component-names
    name: 'Data'
  }
</script>

<style lang="less" scoped>
  .projects-runs-page {
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

      dl {
        list-style-type: circle;
      }
    }
  }
</style>
