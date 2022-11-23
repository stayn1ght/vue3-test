<template>
  <div class="marker-taxon-page">
    <h1>Marker taxa <i class="iconfont icon-star"></i></h1>
    <div class="info mt-8">
      <p>
        "<span class="font-bold">Marker taxa</span>" refer to taxon (at species and genus levels)
        that show sigificant differences in relative abundances between phenotypes.
      </p>
      <p>
        In
        <logo class="font-bold" />
        , marker taxa were identified using
        <my-link
          is-external
          :show-icon="false"
          to="https://huttenhower.sph.harvard.edu/lefse/#:~:text=LEfSe%20(Linear%20discriminant%20analysis%20Effect,encoding%20biological%20consistency%20and%20effect"
          >LEfSe (Linear discriminant analysis Effect Size) analysis
          <i class="iconfont icon-share"></i
        ></my-link>
      </p>
      <dl>
        <dt
          >Please note only a limited number of projects have been analyzed. So far,
          <logo /> includes :</dt
        >
        <dd>
          <dl>
            <dt
              ><span class="text-red-800 font-bold italic">{{ metadata.marker_taxa_count }}</span>
              marker taxa, including</dt
            >
            <dd
              ><span class="text-red-800 font-bold italic">{{
                metadata.marker_species_count
              }}</span>
              marker species and</dd
            >
            <dd
              ><span class="text-red-800 font-bold italic">{{ metadata.marker_genus_count }}</span>
              marker genera,</dd
            >
            identified from
          </dl>
        </dd>
        <dd
          ><span class="text-red-800 font-bold italic">{{ metadata.projects }}</span> projects
          <i class="iconfont icon-gou"></i> and</dd
        >
        <dd
          ><span class="text-red-800 font-bold italic">{{ metadata.phenotype_pairs }}</span>
          phenotype comparisons <i class="iconfont icon-gou"></i>.</dd
        >
      </dl>
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
      :default-sort="{ prop: 'phenotype_combinations', order: 'descending' }"
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
          :cell-class-name="setPhenotypeCls"
        >
          <template #pid="{ row }">
            <my-link :to="`/data/project/${row.project_id}`">{{ row.project_id }}</my-link>
          </template>
          <template #phenotype1="{ row }">
            <my-link :to="`/phenotypes/${row.phenotype1}`">
              {{ row.phenotype1_term }}
              <span v-if="row.LDA < 0"> : {{ row.LDA?.toFixed(3) }}</span>
            </my-link>
            <el-tooltip
              content="view details of this disease at NCBI MeSH website in a new window/tab"
              effect="dark"
              placement="top"
            >
              <el-button
                style="float: right"
                type="primary"
                size="small"
                @click="navigateTo('https://meshb.nlm.nih.gov/record/ui?ui=' + row['phenotype1'])"
              >
                link to: MeSH db&nbsp;
                <el-icon><Share /></el-icon>
              </el-button>
            </el-tooltip>
          </template>
          <template #phenotype2="{ row }">
            <my-link :to="`/phenotypes/${row.phenotype2}`">
              {{ row.phenotype2_term }}
              <span v-if="row.LDA > 0"> : {{ row.LDA?.toFixed(3) }}</span>
            </my-link>
            <el-tooltip
              content="view details of this disease at NCBI MeSH website in a new window/tab"
              effect="dark"
              placement="top"
            >
              <el-button
                style="float: right"
                type="primary"
                size="small"
                @click="navigateTo('https://meshb.nlm.nih.gov/record/ui?ui=' + row['phenotype2'])"
              >
                link to: MeSH db&nbsp;
                <el-icon><Share /></el-icon>
              </el-button>
            </el-tooltip>
          </template>
          <template #comparison="{ row }">
            <my-link :to="`/phenotypes/comparisons/${row.phenotype1}/${row.phenotype2}`" />
          </template>
        </base-table>
      </template>
      <template #scientific_nameHeader="{ label }">
        {{ label }}
        <el-input
          v-model="searchForm.name"
          style="width: calc(100% - 80px); display: inline"
          @click.stop
          placeholder="Filter scientific name"
        />
      </template>
      <template #taxon_rank_levelHeader="{ label }">
        {{ label }}
        <el-select v-model="searchForm.rank" style="width: 100px" size="small">
          <el-option
            v-for="item in ranks"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <template #name="{ row }">
        <my-link :to="`/taxon/${row.ncbi_taxon_id}`">{{ row.scientific_name }}</my-link>
        <div style="float: right">
          <el-tooltip
            content="view details of this species in NCBI Taxonomy in a new window/tab"
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
            content="view details of this species in ENA in a new window/tab"
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
    </base-table>
  </div>
</template>

<script setup lang="ts">
  import { Share, Search, Refresh } from '@element-plus/icons-vue'
  import { useSaveScrollPosition } from '@/hooks/saveScrollPosition'
  import { MarkerSpecies, Metadata } from '@api/taxon/marker/types'
  import { useTableTools } from '@/hooks/table'
  import { getAllMarkerTaxa, getDetailsOfAMarkerSpecies } from '@api/taxon/marker'
  const scrollTop = ref(0)
  useSaveScrollPosition(scrollTop)

  const species = ref<MarkerSpecies[]>([])
  const metadata = reactive<Metadata>({})
  const expandedRowKey = ref<number[]>([])
  const searchForm = reactive({
    rank: '',
    name: ''
  })
  const ranks = ref<any[]>([])
  watch(searchForm, () => {
    const { rank, name } = searchForm
    table.totalData = species.value.slice()
    if (rank.length) {
      table.totalData = table.totalData.filter((item) => item.taxon_rank_level === rank)
    }
    if (name.length) {
      table.totalData = table.totalData.filter(
        (item) => item.scientific_name?.toLowerCase()?.indexOf(name.toLowerCase()) !== -1
      )
    }
    table.page = 1
    table.total = table.totalData.length
    getTableData()
  })
  const tableHead = [
    {
      label: 'Scientific name',
      slotName: 'name',
      customHeader: true,
      prop: 'scientific_name',
      sortOrders: ['descending', 'ascending'],
      sortable: 'custom'
    },
    {
      label: 'Taxonomic rank',
      prop: 'taxon_rank_level',
      width: '150',
      sortable: false,
      customHeader: true
    },
    {
      label: 'Nr. entries',
      prop: 'num_comparisons',
      width: '150',
      sortOrders: ['descending', 'ascending'],
      sortable: 'custom'
    },
    {
      label: 'Nr. projects',
      prop: 'projects',
      width: '150',
      sortOrders: ['descending', 'ascending'],
      sortable: 'custom'
    },
    {
      label: 'Nr. phenotype comparisons',
      prop: 'phenotype_combinations',
      width: '250',
      sortOrders: ['descending', 'ascending'],
      sortable: 'custom'
    }
  ]
  const table = reactive({
    data: [] as MarkerSpecies[],
    total: 0,
    page: 1,
    limit: 10,
    keywords: '',
    totalData: [] as MarkerSpecies[],
    except: false
  })
  const { searchTable, refreshSearch, changePage, handleSortChange, getTableData } =
    useTableTools<MarkerSpecies>(species, table, expandedRowKey, null, searchForm)
  const navigateTo = (url: string) => {
    window.open(url)
  }
  const setPhenotypeCls = ({ row, columnIndex }: any) => {
    if (columnIndex === 1) {
      if (row.LDA < 0) return 'bg-blue-100'
    }
    if (columnIndex === 2) {
      if (row.LDA > 0) return 'bg-pink-100'
    }
    return ''
  }
  getAllMarkerTaxa(species, metadata, ranks, searchTable)

  const subTableHead = [
    { label: 'Project ID', prop: 'project_id', slotName: 'pid', width: '200' },
    {
      label: 'Phenotype 1',
      prop: 'phenotype1_term',
      sortOrders: ['descending', 'ascending'],
      slotName: 'phenotype1'
    },
    {
      label: 'Phenotype 2',
      prop: 'phenotype2_term',
      sortOrders: ['descending', 'ascending'],
      slotName: 'phenotype2'
    },
    { label: 'Phenotype comparison', sortable: false, slotName: 'comparison', width: '105' }
  ]
  const expandChange = (row: MarkerSpecies, expandedRows: any) => {
    if (expandedRows.length > 0 && !row.children?.length) {
      getDetailsOfAMarkerSpecies(row.ncbi_taxon_id as number).then((res) => {
        const subChildren = res.details_of_a_marker_species
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
</script>

<script lang="ts">
  export default {
    name: 'TaxonMarker'
  }
</script>

<style lang="less" scoped>
  .marker-taxon-page {
    .info {
      background: #f5f5f5;
      padding: 15px;
      margin-bottom: 20px;
      color: #666;
    }
    dl {
      list-style-type: disc;
      dd {
        display: list-item;
        margin-inline-start: 3em;
      }
      dl {
        list-style-type: circle;
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
