<template>
<div class="related-samples-runs">
  <p>
    In total <span
      class="text-red-800 font-bold italic">{{ total.toLocaleString() }}</span> samples/runs are related to this phenotype.
    <my-link :to="`https://gmrepo.humangut.info/Downloads/RunsByPhenotypeID/all_runs_associated_with_${id}.tsv.gz`" is-external
             :show-icon="false">Download all runs as tsv
      <el-icon style="vertical-align: text-bottom">
        <Download/>
      </el-icon>.
    </my-link>
    <my-link :to="`https://gmrepo.humangut.info/Downloads/RunsByPhenotypeID/all_unique_run_ids_associated_with_${id}.tsv.gz`" is-external
             :show-icon="false">Download a list of unique run IDs (and only run IDs) associated with current phenotype as tsv
      <el-icon style="vertical-align: text-bottom">
        <Download/>
      </el-icon>.
    </my-link>
  </p>
  <div class="search-wrapper mt-20px">
    <el-checkbox v-model="table.except" label="Except for..." class="pl-10px !mr-10px" />
    <el-input placeholder="Search term" v-model="table.keywords" />
    <el-button type="primary" :icon="Search" class="ml-10px">Search</el-button>
    <el-button :icon="Refresh" round />
  </div>
  <base-table
      @pagination-change="changePage"
      :table-data="table.data"
      :table-head="tableHead"
      :total="tableTotal"
      :loading="loading"
      :cell-class-name="setQcStatusBg"
      :default-sort="{ prop: 'nr_reads_sequenced', order: 'descending' }"
  >
    <template #projectId="{ row }">
      <my-link :to="`/data/project/${row['project_id']}`">
        {{ row['project_id'] }}
      </my-link>&thinsp;
      <my-link :to="`https://www.ncbi.nlm.nih.gov/bioproject/${row['project_id']}`" is-external />
    </template>
    <template #runId="{ row }">
      <my-link :to="`/data/run/${row['run_id']}`">
        {{ row['project_id'] }}
      </my-link>&thinsp;
      <my-link :to="`https://trace.ncbi.nlm.nih.gov/Traces/sra/?run=${row['run_id']}`" is-external />
    </template>
    <template #reads="{ row }">
      {{ row.nr_reads_sequenced?.toLocaleString() }}
    </template>
    <template #description="{ row }">
      <el-tooltip :content="row.original_sample_description" placement="top" v-if="row.original_sample_description">
        <p style="display: -webkit-box; text-overflow: ellipsis; overflow: hidden; -webkit-line-clamp: 3; -webkit-box-orient: vertical">{{ row.original_sample_description }}</p>
      </el-tooltip>
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

<script lang="ts" setup>
import {Download, Refresh, Search, Share} from '@element-plus/icons-vue'
import {rulesItem} from "@api/phenotypes/detail/types";
import {searchRuns} from "@api/home";
import useLoading from "@/hooks/loading";
import {getAssRunsById} from "@api/phenotypes/detail";

const props = defineProps<{
  id: string,
  total: number,
  tableTotal: number
}>()

const { loading, toggle } = useLoading()
const table = reactive({
  data: [] as rulesItem[],
  total: 0,
  page: 1,
  limit: 10,
  keywords: '',
  totalData: [] as rulesItem[],
  except: false
})
const tableHead = [
  { label: 'ProjectID', prop: 'project_id', slotName: 'projectId' },
  { label: 'RunID', prop: 'run_id', slotName: 'runId' },
  { label: 'Experiment type', prop: 'experiment_type', width: '150' },
  { label: 'Instrument', prop: 'instrument_model', width: '100' },
  { label: 'Nr. sequenced reads', prop: 'nr_reads_sequenced', slotName: 'reads', width: '120' },
  { label: 'Host age', prop: 'host_age', width: '60' },
  { label: 'Gender', prop: 'sex', width: '75' },
  { label: 'BMI', prop: 'BMI', width: '55' },
  { label: 'Geo location', prop: 'country', width: '110' },
  { label: 'Description', prop: 'original_sample_description', width: '200', slotName: 'description' },
  { label: 'QC Status*', prop: 'QCStatus', width: '95' }
]
const changePage = (data: any) => {
  table.page = data.currentPage
  table.limit = data.pageSize
  getTableData()
}
const getTableData = () => {
  toggle()
  getAssRunsById(props.id, table.limit, (table.page - 1) * table.limit)
      .then((res) => {
        table.data = res
        toggle()
      })
}
const setQcStatusBg = ({row, columnIndex}: any) => {
  if (columnIndex === 10) {
    if (row['QCStatus'] === 1) return 'bg-green-100/30'
    else if (row['QCStatus'] === 0) return 'bg-red-100/30'
    return 'bg-gray-100/30'
  }
}
getTableData()
</script>

<style scoped lang="less">
.search-wrapper {
  display: flex;
  .el-input {
    flex: 1
  }
}
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
</style>
