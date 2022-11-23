<template>
    <div class="projects">
      <div class="query-pane">
        <project-selector
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
        <p class="mt-40px">In total <span class="text-red-900 font-bold italic">{{ table.total.toLocaleString() }}</span> entries obtained from your query.</p>
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
            <my-link :to="`/data/project/${row['project_id']}`">
              {{ row['project_id'] }}
            </my-link>&thinsp;
            <my-link :to="`https://www.ncbi.nlm.nih.gov/bioproject/${row['project_id']}`" is-external />
          </template>
          <template #phenotype="{ row }">
            <my-link :to="`/phenotypes/${row['disease']}`">
              {{ row['disease'] }}: {{ row['term'] }}
            </my-link>&thinsp;
            <my-link :to="`https://meshb.nlm.nih.gov/record/ui?ui=${row['disease']}`" is-external />
          </template>
          <template #controls="{ row }">
            {{ row['has_healthy_controls'] }} ({{ row['nr_healthy_controls'] }})
          </template>
        </base-table>
        <div class="mt-24px">
          <my-link to="#" :show-icon="false" is-external @click.prevent="handleDownloadSelectedProjects">
            Download data as tsv&nbsp;<el-icon style="vertical-align: middle;"><Download /></el-icon>
          </my-link>
        </div>
        <dl class="info !p-25px">
          <dt><el-icon><InfoFilled /></el-icon> Note:</dt>
          <dd class="first-item">
            <span class="font-bold">Async table is used</span>: therefore only partial data were downloaded for display.
          </dd>
          <dd class="first-item">
            <span class="font-bold">About the number of projects</span>: almost all projects contain runs/samples multiple phenotypes (e.g. patients and healthy controls). Therefore these projects could appear multiple times in the above table if a user did not restrict his/her search to a specific phenotype, and the number of retrieved projects could be larger than it should be.
          </dd>
        </dl>
      </template>
    </div>
</template>
<script setup>
import {applyReactInVue} from 'veaury'
import QueryBuilder from "../Selector/QueryBuilder2.jsx";
import useHomeData from "../../../../hooks/homeData";
import {fields, initValue1, initValue3, initValue2, initValue} from '../Selector/ProjectSelectorConfig'
import {downloadSelectedProjects, searchProjects, searchProjectsSum} from "../../../../api/home";
import { Download, InfoFilled } from '@element-plus/icons-vue'
import {download} from "../../../../utils";
import useLoading from "../../../../hooks/loading";


const ProjectSelector = applyReactInVue(QueryBuilder)
const { phenotype } = useHomeData()

const { loading, toggle } = useLoading()
const tableHead = [
  { label: 'ProjectID', prop: 'project_id', slotName: 'projectId', width: '150' },
  { label: 'Phenotype', slotName: 'phenotype' },
  { label: 'Nr. of total runs', prop: 'nr_total_runs', width: '120' },
  { label: 'Nr. of valid runs', prop: 'nr_valid_runs', width: '120' },
  { label: 'Nr. of failed runs', prop: 'nr_failed_runs', width: '120' },
  { label: '%. of failed runs', prop: 'pct_failed_runs', width: '120' },
  { label: 'Has healthy controls in the same project (Nr. healthy controls)', slotName: 'controls' }
]
const table = reactive({
  total: 0,
  data: [],
  page: 1,
  limit: 10,
  sql: ''
})
const handleSearch = async (sql) => {
  const runsSum = await searchProjectsSum(sql)
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
  searchProjects({sql: table.sql, limit: table.limit, skip: (table.page - 1) * table.limit})
      .then((res) => {
        table.data = res
        toggle()
      })
}

const handleDownloadSelectedProjects = async () => {
  const res = await downloadSelectedProjects(table.sql)
  let contents = `#user selection logic: ${table.sql}\n` +
      `#run count: ${table.total}\n` +
      `${["Project ID", "Phenotype MESH ID", "Phenotype name",
        "Nr. runs of this phenotype", "Nr. valid runs of this phenotype",
        "Nr. failed runs of this phenotype",
        "Nr. runs of healthy controls in the same project",
        "Has healthy controls in the same project",
        "%. failed runs of this phenotype"
      ].join("\t")}\n`
  res.forEach((item) => {
    const arr = []
    for (const k in item) arr.push(item[k])
    contents += arr.join('\t') + '\n'
  })
  const data = new Blob([contents], {
    type: 'text/plain;charset=utf-8'
  })
  const fileName = 'user_selected_projects_list_' + Date.now().toString() + '.txt'
  download(data, fileName)
}
</script>

<style lang="less" scoped>
.projects {
  .query-pane {
    margin: 20px 0;
    border-left: 3px solid #faebcc;
    background-color: #faf8f0;
  }
  .info {
    background: #f5f5f5;
    list-style-type: disc;

    .first-item {
      display: list-item;
      margin-inline-start: 3em;
    }
  }
}
</style>
