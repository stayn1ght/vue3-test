<template>
<div class="related-projects">
  <p>
    In total <span
      class="text-red-800 font-bold italic">{{ projects.length.toLocaleString() }}</span> project(s) contain samples of this phenotype.
    <my-link :to="`https://gmrepo.humangut.info/Downloads/ProjectsByPhenotypeID/all_projects_contain_samples_of_${id}.tsv.gz`" is-external
             :show-icon="false">Download all associated projects as tsv
      <el-icon style="vertical-align: text-bottom">
        <Download/>
      </el-icon>.
    </my-link>
  </p>
  <div class="search-wrapper mt-20px">
    <el-checkbox v-model="table.except" label="Except for..." class="pl-10px !mr-10px" />
    <el-input placeholder="Search term" v-model="table.keywords" />
    <el-button type="primary" :icon="Search" class="ml-10px" @click="searchTable">Search</el-button>
    <el-button :icon="Refresh" round @click="refreshSearch" />
  </div>
  <base-table
      @pagination-change="changePage"
      :table-data="table.data"
      :table-head="tableHead"
      :total="table.total"
      :default-sort="{ prop: 'loaded_samples', order: 'descending' }"
      @sort-change="handleSortChange"
  >
    <template #pid="{ row }">
      <my-link :to="`/data/project/${row['project_id']}`">
        {{ row['project_id'] }}
        <template v-if="row.hasmarker">
          <i class="iconfont icon-star" />&nbsp;
        </template>
        <i class="iconfont icon-gou" v-if="row.iscurated" />
      </my-link>&nbsp;
      <my-link :to="`https://www.ncbi.nlm.nih.gov/bioproject/${row.project_id}`" is-external :show-icon="false"><i class="iconfont icon-share" /></my-link>
    </template>
    <template #pOfTotal="{ row }">
      {{ row.loaded_samples?.toLocaleString() }}
      ({{ row.samples_per_project?.toLocaleString() }})
    </template>
    <template #publicans="{ row }">
      <ul v-if="row.Related_Publications" style="list-style-type: disc; margin-left: 3px;">
        <li v-for="publican in row.Related_Publications.toString().split(',')" style="display: list-item">
          <my-link :to="`https://pubmed.ncbi.nlm.nih.gov/${publican}/`" is-external :show-icon="false">
            {{ publican }}
            <i class="iconfont icon-share"/>
          </my-link>
        </li>
      </ul>
      <span v-else>NA</span>
    </template>
    <template #description="{ row }">
      <el-tooltip :content="row.Original_Project_description" placement="top">
        <p style="display: -webkit-box; text-overflow: ellipsis; overflow: hidden; -webkit-line-clamp: 3; -webkit-box-orient: vertical">{{ row.Original_Project_description }}</p>
      </el-tooltip>
    </template>
  </base-table>
  <ul class="info mt-20px">
    <dt>Note:</dt>
    <dd>
      <i class="iconfont icon-star text-red-800 bg-red-100/50" />&nbsp;
      next to project names indicates marker taxa have been identified for these projects. Please go to the "In-depth analysis" section of the individual project pages for details.
    </dd>
    <dd>
      <i class="iconfont icon-gou text-red-800 bg-red-100/50" />
      indicates
      <my-link to="/data/curatedprojects" :show-icon="false">curated projects <i class="iconfont icon-gou" /> <i class="iconfont icon-star" /></my-link>
    </dd>
  </ul>
</div>
</template>

<script lang="ts" setup>
import {Download, Refresh, Search, Share} from '@element-plus/icons-vue'
import {assoc_projectsItem} from "@api/phenotypes/detail/types";
import {useTableTools} from "@/hooks/table";

const props = defineProps<{
  data: assoc_projectsItem[],
  id: string
}>()

const tableHead = [
  {label: 'ProjectID', slotName: 'pid', prop: 'project_id', width: '200', sortable: 'custom', sortOrders: ['descending', 'ascending']},
  {label: 'Nr. of processed (total) runs', slotName: 'pOfTotal', prop: 'loaded_samples', width: '300', sortable: 'custom', sortOrders: ['descending', 'ascending']},
  {label: 'Related publican(s)', slotName: 'publicans', width: '200', sortable: false},
  {label: 'Description', sortable: false, slotName: 'description'}
]
const table = reactive({
  data: [] as assoc_projectsItem[],
  total: 0,
  page: 1,
  limit: 10,
  keywords: '',
  totalData: [] as assoc_projectsItem[],
  except: false
})
const projects = ref<assoc_projectsItem[]>([])
const { handleSortChange, searchTable, refreshSearch, changePage, getTableData } = useTableTools<assoc_projectsItem>(projects, table)
watch(() => props.data, (val) => {
  projects.value = val
  searchTable()
})
const navigateTo = (url: string) => {
  window.open(url)
}
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
}
</style>
