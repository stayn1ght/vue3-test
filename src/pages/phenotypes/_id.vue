<template>
  <div class="phenotypes-detail-page">
    <h1
      >Gut microbiota associated with
      <my-link :to="`https://meshb.nlm.nih.gov/record/ui?ui=${metadata.uid}`" is-external>{{
        metadata.term
      }}</my-link></h1
    >
    <div class="info">
      <dl>
        <dt>
          <my-link :to="`https://meshb.nlm.nih.gov/record/ui?ui=${metadata.uid}`" is-external>{{
            metadata.term
          }}</my-link
          >:
          {{ metadata.note }}
        </dt>
        <dd class="font-bold"
          >Nr. related projects: <span class="text-red-800 italic">{{ projects.length }}</span></dd
        >
        <dd class="font-bold"
          >Nr. total runs:
          <span class="text-red-800 italic">{{
            stats.nr_total_samples?.toLocaleString()
          }}</span></dd
        >
        <dd class="font-bold"
          >Nr. processed runs:
          <span class="text-red-800 italic">{{
            stats.nr_loaded_samples?.toLocaleString()
          }}</span></dd
        >
        <dd class="font-bold"
          >Nr. valid runs:
          <span class="text-green-800 italic">{{
            stats.nr_valid_samples?.toLocaleString()
          }}</span></dd
        >
      </dl>
      <hr />
      <div>
        <p class="font-bold">Disease markers:</p>
        <p
          >Marker taxa have been identified for the following phenotype(s) as compared with
          <my-link :to="`https://meshb.nlm.nih.gov/record/ui?ui=${metadata.uid}`" is-external>{{
            metadata.term
          }}</my-link
          >：</p
        >
      </div>
      <base-table
        @pagination-change="changePage"
        :table-data="table.data"
        :table-head="tableHead"
        :total="table.total"
        :default-sort="{ prop: 'markers', order: 'descending' }"
        @sort-change="handleSortChange"
      >
        <template #phenotype1="{ row }">
          <my-link :to="`/phenotypes/${row['phenotype1']}`">{{ row['phenotype1_term'] }}</my-link
          >&nbsp;
          <my-link
            :to="`https://meshb.nlm.nih.gov/record/ui?ui=${row['phenotype1']}`"
            is-external
            :show-icon="false"
            ><i class="iconfont icon-share"></i
          ></my-link>
        </template>
        <template #phenotype2="{ row }">
          <my-link :to="`/phenotypes/${row['phenotype2']}`">{{ row['phenotype2_term'] }}</my-link
          >&nbsp;
          <my-link
            :to="`https://meshb.nlm.nih.gov/record/ui?ui=${row['phenotype2']}`"
            is-external
            :show-icon="false"
            ><i class="iconfont icon-share"></i
          ></my-link>
        </template>
        <template #operation="{ row }">
          <my-link
            :show-icon="false"
            :to="`/phenotypes/comparisons/${row.phenotype1}/${row.phenotype2}`"
          >
            view details
            <i class="iconfont icon-right"></i>
          </my-link>
        </template>
      </base-table>
    </div>
    <el-tabs v-model="activeName" class="mt-24px">
      <!-- <el-tab-pane name="species">
        <template #label>
          <span class="text-xl">
            <el-icon><List /></el-icon>
            Associated Species
          </span>
        </template>
        <species
          :data="species"
          :d3-data="d3Species"
          :total="stats.nr_species || 0"
          :id="id"
          :term="metadata.term"
          :pair-total="stats.num_cooccuring_pairs_species"
          :num="stats.num_cooccuring_pairs_to_get"
        />
      </el-tab-pane> -->
      <el-tab-pane name="genus">
        <template #label>
          <span class="text-xl">
            <el-icon><Grid /></el-icon>
            Associated genus
          </span>
        </template>
        <genus
          :data="genus"
          :d3-data="d3Genus"
          :total="stats.nr_genus || 0"
          :id="id"
          :term="metadata.term"
          :pair-total="stats.num_cooccuring_pairs_genus"
          :num="stats.num_cooccuring_pairs_to_get"
        />
      </el-tab-pane>
      <el-tab-pane name="projects">
        <template #label>
          <span class="text-xl">
            <el-icon><Briefcase /></el-icon>
            Associated projects
          </span>
        </template>
        <projects :data="projects" :id="id" />
      </el-tab-pane>
      <el-tab-pane name="runs">
        <template #label>
          <span class="text-xl">
            <el-icon><Histogram /></el-icon>
            Associated samples/runs
          </span>
        </template>
        <samples-runs
          :id="id"
          :total="stats.nr_loaded_samples || 0"
          :table-total="stats.nr_total_samples || 0"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
  import { Share, List, Grid, Briefcase, Histogram } from '@element-plus/icons-vue'
  import { getAllMicrobiotaDatasets } from '@/api/phenotypes/detail'
  import {
    statsItem,
    metadataItem,
    assoc_projectsItem,
    phenotype_comparesItem,
    associated_speciesItem,
    associated_genusItem,
    networkdata_d3_genusItem,
    networkdata_d3_speciesItem
  } from '@/api/phenotypes/detail/types'
  import { useTableTools } from '@/hooks/table'
  import Genus from './components/Genus.vue'
  import Projects from './components/Projects.vue'
  import SamplesRuns from './components/SamplesRuns.vue'
  // import Species from './components/Species.vue'

  const router = useRouter() // 获取 router 实例
  const { id } = router.currentRoute.value.params
  // console.log(router.currentRoute.value.params)
  // id 用 { id } 解构赋值，等价于 const id = router.currentRoute.value.params.id
  const stats = reactive<statsItem>({})
  const metadata = reactive<metadataItem>({})
  const comparisons = ref<phenotype_comparesItem[]>([])
  // const species = ref<associated_speciesItem[]>([]) 
  const genus = ref<associated_genusItem[]>([])
  const projects = ref<assoc_projectsItem[]>([])

  const tableHead = [
    { label: 'Phenotype1', slotName: 'phenotype1', prop: 'phenotype1_term' },
    { label: 'Phenotype2', slotName: 'phenotype2', prop: 'phenotype2_term' },
    {
      label: 'Nr. marker taxa',
      prop: 'markers',
      width: '150',
      sortable: 'custom',
      sortOrders: ['descending', 'ascending']
    },
    { label: '', slotName: 'operation', sortable: false, width: '130' }
  ]
  const table = reactive({
    data: [] as phenotype_comparesItem[],
    total: 0,
    page: 1,
    limit: 10,
    totalData: [] as phenotype_comparesItem[],
    keywords: '',
    except: false
  })
  const { handleSortChange, changePage, searchTable } = useTableTools<phenotype_comparesItem>(
    comparisons,
    table
  )

  // 设置默认获取焦点的组件
  const activeName = ref('genus')

  const d3Genus = reactive<networkdata_d3_genusItem>({})
  // const d3Species = reactive<networkdata_d3_speciesItem>({})

  getAllMicrobiotaDatasets(
    id,
    metadata,
    stats,
    comparisons,
    // species,
    genus,
    projects,
    d3Genus,
    // d3Species,
    searchTable
  )
</script>

<style lang="less" scoped>
  .phenotypes-detail-page {
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
      hr {
        margin-top: 23px;
        margin-bottom: 23px;
        border: 0;
        border-top: 1px solid #eeeeee;
      }
    }
  }
</style>
