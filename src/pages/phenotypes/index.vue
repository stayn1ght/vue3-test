<template>
  <div class="phenotypes-page">
    <h1>Phenotypes</h1>
    <p class="info">
      Phenotypes refer to the heath and disease statuses of humans from which the fecal samples were
      taken. In total
      <span class="text-red-800 italic font-bold">{{ phenotypes?.length }}</span>
      phenotypes are included in our database.</p
    >
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
      :loading="loading"
      :default-sort="{ prop: 'all_samples', order: 'descending' }"
      :cell-class-name="setFailedRunsClass"
      @sort-change="handleSortChange"
    >
      <template #phenotype="{ row }">
        <span v-if="row[3] === 0">{{ row['term'] }}</span>
        <my-link v-else :to="`/phenotypes/${row['disease']}`">{{ row['term'] }}</my-link>
        <el-tooltip
          content="view details of this disease at NCBI MeSH website in a new window/tab"
          effect="dark"
          placement="top"
        >
          <el-button
            type="primary"
            size="small"
            style="float: right"
            @click="navigateTo(row['disease'])"
          >
            link to: MeSH db&nbsp;
            <el-icon><Share /></el-icon>
          </el-button>
        </el-tooltip>
      </template>
      <template #speciesGenera="{ row }">
        <span>{{ row['nr_species'] }}</span>
        (<span>{{ row['nr_genus'] }}</span
        >)
      </template>
    </base-table>
    <dl class="info mt-20px">
      <dt>Note:</dt>
      <dd>nr. runs: all runs with meta-data currated,</dd>
      <dd>
        nr. processed_runs: number of all runs with the sequence data processed; please note
        eventually all runs will be processed eventually,
      </dd>
      <dd>
        nr. valid runs: number of runs whose data passed our QC procedure and the corresponding
        species/genus relative abundances are available in our database,
      </dd>
      <dd>nr. failed runs: number of runs whose data DID NOT passed our QC procedure,</dd>
      <dd>
        nr. associated species: number of species associated with the processed and valid runs.
      </dd>
    </dl>
  </div>
</template>

<script setup lang="ts">
  import { Share, Search, Refresh } from '@element-plus/icons-vue'
  import { useSaveScrollPosition } from '@/hooks/saveScrollPosition'
  import { getAllPhenotypes } from '@/api/phenotypes'
  import { Phenotype } from '@api/phenotypes/types'
  import { useTableTools } from '@/hooks/table'
  const scrollTop = ref(0)
  useSaveScrollPosition(scrollTop)

  const setFailedRunsClass = ({ columnIndex }: any) => {
    if (columnIndex === 4) return 'text-red-700'
  }

  const tableHead = [
    { label: 'Phenotype', slotName: 'phenotype', prop: 'disease' },
    {
      label: 'Nr. runs',
      prop: 'all_samples',
      width: '100',
      sortOrders: ['descending', 'ascending'],
      sortable: 'custom'
    },
    {
      label: 'Nr. processed runs *',
      prop: 'processed_runs',
      width: '180',
      sortOrders: ['descending', 'ascending'],
      sortable: 'custom'
    },
    {
      label: 'Nr. valid runs',
      prop: 'valid_runs',
      width: '150',
      sortOrders: ['descending', 'ascending'],
      sortable: 'custom'
    },
    {
      label: 'Nr. failed runs',
      prop: 'failed_runs',
      width: '150',
      sortOrders: ['descending', 'ascending'],
      sortable: 'custom'
    },
    {
      label: 'Nr. associated species (genera)',
      prop: 'nr_species',
      slotName: 'speciesGenera',
      sortOrders: ['descending', 'ascending'],
      sortable: 'custom'
    }
  ]
  const table = reactive({
    data: [] as Phenotype[],
    total: 0,
    page: 1,
    limit: 10,
    keywords: '',
    totalData: [] as Phenotype[],
    except: false
  })
  const phenotypes = ref<Phenotype[]>([])
  const map = {
    all_samples: '1',
    processed_runs: '2',
    valid_runs: '3',
    failed_runs: '4',
    nr_species: '5'
  }
  const { searchTable, refreshSearch, changePage, handleSortChange } = useTableTools<Phenotype>(
    phenotypes,
    table,
    null,
    map
  )
  getAllPhenotypes(phenotypes, searchTable)

  const navigateTo = (disease: string) => {
    window.open('https://meshb.nlm.nih.gov/record/ui?ui=' + disease)
  }
</script>

<script lang="ts">
  export default {
    name: 'phenotypes'
  }
</script>

<style lang="less" scoped>
  .phenotypes-page {
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
    .search-wrapper {
      display: flex;
      .el-input {
        flex: 1;
      }
    }
  }
</style>
