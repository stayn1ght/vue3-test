<template>
  <div class="ass-species-detail-page">
    <h1>
      Details of
      <my-link :to="`/species/${taxon}`" :show-icon="false"
        ><span class="italic">{{ stats.name }}</span> ({{ stats.node_rank }})
        <i class="iconfont icon-share"></i
      ></my-link>
      in
      <my-link :to="`/phenotypes/${disease}`" :show-icon="false"
        >{{ stats.term }} <i class="iconfont icon-share"></i>
      </my-link>
    </h1>
    <div class="info">
      <dl>
        <dt>
          <my-link
            :to="`https://meshb.nlm.nih.gov/record/ui?ui=${disease}`"
            :show-icon="false"
            is-external
          >
            {{ stats.term }} <i class="iconfont icon-share"></i
          ></my-link>
          : The state of the organism when it functions optimally without evidence of disease.
        </dt>
        <dd class="font-bold">
          <span>Nr. all runs:</span>
          <span class="text-red-800 italic">{{ stats.all_samples?.toLocaleString() }}</span>
        </dd>
        <dd class="font-bold">
          Nr. processed runs:
          <span class="text-red-800 italic">{{ stats.processed_runs?.toLocaleString() }}</span>
        </dd>
        <dd class="font-bold">
          Nr. valid runs:
          <span class="text-green-800">{{ stats.valid_runs?.toLocaleString() }}</span>
        </dd>
        <dd>
          <span class="font-bold">among which,</span>
          Bacteroides uniformis could be found in
          <span class="font-bold text-red-800 italic">{{
            stats.total_loaded_samples?.toLocaleString()
          }}</span>
          of the samples, account for
          <span class="font-bold text-red-800 italic"
            >{{ stats.pct_of_loaded_samples?.toFixed(3) }}%</span
          >
          of the total.
        </dd>
      </dl>
      <dl class="mt-20px">
        <dt>Please use the following links to:</dt>
        <dd>
          <my-link :to="`/species/${taxon}`"
            >view all phenotypes associated with Bacteroides uniformis (species) in our database
          </my-link>
        </dd>
        <dd>
          <my-link
            :to="`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=${taxon}`"
            :show-icon="false"
            is-external
            >view details of Bacteroides uniformis (species) in NCBI Taxonomy in a new window/tab
            <i class="iconfont icon-share"></i
          ></my-link>
        </dd>
        <dd>
          <my-link :to="`/phenotypes/${disease}`"
            >view all taxa associated with Health in our database</my-link
          >
        </dd>
        <dd>
          <my-link
            :to="`https://meshb.nlm.nih.gov/record/ui?ui=${disease}`"
            :show-icon="false"
            is-external
            >view details of Health at NCBI MeSH website in a new window/tab
            <i class="iconfont icon-share"></i
          ></my-link>
        </dd>
      </dl>
    </div>
    <hr />
    <h3 class="text-24px my-12px">Statistics</h3>
    <v-plotly :plotly-data="plotData" :plotly-layout="plotLayout" />
    <div v-if="!stats.densityPlotData">
      <el-icon>
        <WarningFilled />
      </el-icon>
      <code>NO statistics found</code> for <span class="font-bold italic">{{ stats.name }}</span
      >> in current phenotype! please note we require at least 50 samples to do such a statistics.
    </div>
    <el-button
      class="mt-20px"
      size="small"
      v-if="stats.boxplotGood"
      color="#9c27b0"
      @click="toggleOutliers"
    >
      <el-icon> <Setting /> </el-icon>&nbsp;<span class="font-bold">Hide/show outliers</span>
    </el-button>
    <v-plotly :plotly-data="boxplotData" :plotly-layout="boxplotLayout" />
    <div v-if="!stats.boxplotGood">
      <el-icon>
        <WarningFilled />
      </el-icon>
      <code>Boxplot</code> for <span class="font-bold italic">{{ stats.name }}</span
      >> in current phenotype cannot be visualized; please note we require at least 20 samples to do
      such an analysis.
    </div>
    <hr />
    <h3 class="text-24px my-12px">
      <el-icon>
        <List />
      </el-icon>
      Relative abundances
    </h3>
    <p>
      This taxon was found in
      <span class="text-red-800 italic font-bold">{{
        stats.total_loaded_samples?.toLocaleString()
      }}</span>
      samples/runs of current phenotype collected in our database.
      <el-button type="success" @click="handleDownloadAbundanceByMeshIDAndTaxonID" size="small">
        Download data as csv&nbsp;<el-icon>
          <Download />
        </el-icon>
      </el-button>
      <el-button type="primary" @click="handleDownloadAssociatedUniqueRunID" size="small">
        Download unique run IDs as csv&nbsp;<el-icon>
          <Download />
        </el-icon>
      </el-button>
    </p>
    <div class="search-wrapper mt-20px">
      <el-checkbox v-model="abundanceTable.except" label="Except for..." class="pl-10px !mr-10px" />
      <el-input placeholder="Search term" v-model="abundanceTable.keywords" />
      <el-button type="primary" :icon="Search" class="ml-10px" @click="searchAbundanceTable"
        >Search</el-button
      >
      <el-button :icon="Refresh" round @click="refreshAbundanceSearch" />
    </div>
    <base-table
      @pagination-change="changeAbundancePage"
      :table-data="abundanceTable.data"
      :table-head="abundanceTableHead"
      :total="abundanceTable.total"
      :default-sort="{ prop: 'relative_abundance', order: 'descending' }"
      @sort-change="handleAbundanceSortChange"
    >
      <template #projectId="{ row }">
        <my-link :to="`/data/project/${row['project_id']}`"> {{ row['project_id'] }} </my-link
        >&thinsp;
        <my-link :to="`https://www.ncbi.nlm.nih.gov/bioproject/${row['project_id']}`" is-external />
      </template>
      <template #runId="{ row }">
        <my-link :to="`/data/run/${row['run_id']}`"> {{ row['project_id'] }} </my-link>&thinsp;
        <my-link
          :to="`https://trace.ncbi.nlm.nih.gov/Traces/sra/?run=${row['run_id']}`"
          is-external
        />
      </template>
      <template #description="{ row }">
        <el-tooltip :content="row.original_sample_description" placement="top">
          <p
            style="
              display: -webkit-box;
              text-overflow: ellipsis;
              overflow: hidden;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
            "
          >
            {{ row.original_sample_description }}</p
          >
        </el-tooltip>
      </template>
    </base-table>
    <hr />
    <h3 class="text-24px my-12px">
      <el-icon>
        <Menu />
      </el-icon>
      Co-occurred taxa
    </h3>
    <div class="search-wrapper mt-20px">
      <el-checkbox v-model="taxaTable.except" label="Except for..." class="pl-10px !mr-10px" />
      <el-input placeholder="Search term" v-model="taxaTable.keywords" />
      <el-button type="primary" :icon="Search" class="ml-10px" @click="searchTaxaTable"
        >Search</el-button
      >
      <el-button :icon="Refresh" round @click="refreshTaxaSearch" />
    </div>
    <base-table
      @pagination-change="changeTaxaPage"
      :table-data="taxaTable.data"
      :table-head="taxaTableHead"
      :total="taxaTable.total"
      :default-sort="{ prop: 'odds_ratio', order: 'descending' }"
      @sort-change="handleTaxaSortChange"
    >
      <template #taxon="{ row }">
        <my-link :to="`#/phenotypes/${disease}/${row.taxon2}`" is-external
          ><span class="italic">{{ row.taxon2_sci_name }}</span> ({{
            row.taxon_rank_level
          }}) </my-link
        >&nbsp;
        <my-link :to="`#/species/${row.taxon2}`" :show-icon="false" is-external
          ><i class="iconfont icon-right"></i>
        </my-link>
        <el-button
          style="float: right"
          size="small"
          type="success"
          :icon="Download"
          @click="handleDownloadAbundancesByTaxaAndDiseaseId(row)"
          title="download relative abundances of the tow co-occurring taxa in samples of this phenotype"
        />
        <el-tooltip
          content="view details of this taxon in NCBI taxonnomy in a new window/tab"
          effect="dark"
          placement="top"
        >
          <el-button
            type="primary"
            size="small"
            class="mr-5px"
            style="float: right"
            @click="
              navigateTo(
                `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=${row.taxon2}`
              )
            "
          >
            NCBI&nbsp;
            <el-icon>
              <Share />
            </el-icon>
          </el-button>
        </el-tooltip>
      </template>
      <template #pearson="{ row }">
        {{ row.coef_pearson?.toFixed(2) }} ({{ row.pvalue_pearson?.toFixed(4) }})
      </template>
      <template #spearman="{ row }">
        {{ row.coef_spearman?.toFixed(2) }} ({{ row.pvalue_spearman?.toFixed(4) }})
      </template>
      <template #ratio="{ row }">
        {{ row.odds_ratio?.toFixed(2) }} ({{ row.or_conf1?.toFixed(2) }} -
        {{ row.or_conf2?.toFixed(2) }}; {{ row.fisher_pvalue?.toFixed(4) }})
      </template>
      <template #stats="{ row }">
        ({{ row.sample_count_co }}, {{ row.sample_count_taxon1_only }},
        {{ row.sample_count_taxon2_only }}, {{ row.sample_count_none }})
      </template>
    </base-table>
    <el-button
      class="mt-20px"
      @click="handleDownloadAllCoOccurredPairs"
      size="small"
      type="success"
      v-if="taxa.length > 0"
    >
      Download all co-occurred pairs as csv&nbsp;<el-icon>
        <Download />
      </el-icon>
    </el-button>
    <dl class="info mt-20px">
      <dt
        ><el-icon><InfoFilled /></el-icon> Note:</dt
      >
      <dd>
        <span class="font-bold">*</span>:
        <my-link is-external to="https://en.wikipedia.org/wiki/Pearson_correlation_coefficient"
          >Pearson's correlation coefficient</my-link
        >
        ranges from -1 to 1, where 1 is total positive linear correlation, 0 is no linear
        correlation, and −1 is total negative linear correlation.
      </dd>
      <dd>
        <span class="font-bold">**</span>:
        <my-link
          is-external
          to="https://en.wikipedia.org/wiki/Spearman%27s_rank_correlation_coefficient"
          >Spearman's correlation coefficient</my-link
        >
        is a nonparametric measure of rank correlation (statistical dependence between the rankings
        of two variables). It assesses how well the relationship between two variables can be
        described using a monotonic function.
      </dd>
      <dd>
        <span class="font-bold">***</span>:
        <my-link is-external to="https://en.wikipedia.org/wiki/Odds_ratio">Odds ratio (OR)</my-link>
        is used to quantify the strength of the association between the two taxa of interests. An OR
        value larger than 1 with a p value &lt; 0.05 indicates the two taxa are significantly
        co-occurred in samples surveyed. It was calculated using the
        <my-link
          is-external
          to="https://stat.ethz.ch/R-manual/R-devel/library/stats/html/fisher.test.html"
          >fisher.test() function in R</my-link
        >
        on a 2*2 contingency table consisting four values, namely A, B, C, D. See their
      </dd>
      <dd>
        <dl>
          <dt
            ><span class="font-bold">****</span>: Here A, B, C, D are the four values of a 2*2
            contingency table used by the fisher.test() function in R. where:</dt
          >
          <dd><span class="font-bold">A</span>: nr. samples in which both taxa are found,</dd>
          <dd><span class="font-bold">B</span>: nr. samples in which taxon 1 is found,</dd>
          <dd><span class="font-bold">C</span>: nr. samples in which taxon 2 is found,</dd>
          <dd
            ><span class="font-bold">D</span>: nr. samples in which neither taxon 1 nor taxon 2 is
            found.</dd
          >
        </dl>
      </dd>
    </dl>
  </div>
</template>

<script setup lang="ts">
  import { AbundanceAndMetaData, CoOccurredTaxa, Stats } from '@api/phenotypes/speciesDetail/types'
  import {
    downloadAssociatedUniqueRunID,
    downloadAbundanceByMeshIDAndTaxonID,
    getAllMicrobeAbundances,
    downloadAbundancesByTaxaAndDiseaseId
  } from '@/api/phenotypes/speciesDetail'
  import VPlotly from '@/components/VPlotly/index.vue'
  import {
    WarningFilled,
    Setting,
    List,
    Download,
    Search,
    Refresh,
    Menu,
    Share,
    InfoFilled
  } from '@element-plus/icons-vue'
  import { download } from '@/utils'
  import { useTableTools } from '@/hooks/table'

  const router = useRouter()
  const { disease, taxon } = router.currentRoute.value.params

  const stats = reactive<Stats>({})

  const abundances = ref<AbundanceAndMetaData[]>([])
  const abundanceTableHead = [
    { label: 'ProjectID', prop: 'project_id', slotName: 'projectId', width: '150' },
    { label: 'RunID', prop: 'run_id', slotName: 'runId', width: '150' },
    { label: 'Sample name', prop: 'sample_name', width: '150' },
    { label: 'Relative abundance', prop: 'relative_abundance', width: '150' },
    { label: 'Host age', prop: 'host_age', width: '60' },
    { label: 'Gender', prop: 'sex', width: '75' },
    { label: 'BMI', prop: 'BMI', width: '55' },
    { label: 'Geo location', prop: 'country', width: '110' },
    { label: 'Description', prop: 'original_sample_description', slotName: 'description' }
  ]
  const abundanceTable = reactive({
    data: [] as AbundanceAndMetaData[],
    total: 0,
    page: 1,
    limit: 10,
    keywords: '',
    totalData: [] as AbundanceAndMetaData[],
    except: false
  })
  const {
    handleSortChange: handleAbundanceSortChange,
    changePage: changeAbundancePage,
    searchTable: searchAbundanceTable,
    refreshSearch: refreshAbundanceSearch
  } = useTableTools<AbundanceAndMetaData>(abundances, abundanceTable)

  const taxa = ref<CoOccurredTaxa[]>([])
  const taxaTableHead = [
    { label: 'Co-occurred taxon', prop: 'taxon2_sci_name', slotName: 'taxon' },
    { label: 'Pearson * cor (p value)', prop: 'coef_pearson', slotName: 'pearson', width: '200' },
    {
      label: 'Spearman ** cor (p value)',
      prop: 'coef_spearman',
      width: '220',
      slotName: 'spearman'
    },
    { label: 'Odds ratio *** (CI; p value)', prop: 'odds_ratio', width: '230', slotName: 'ratio' },
    { label: 'Stats **** (A, B, C, D)', slotName: 'stats', width: '180', sortable: false }
  ]
  const taxaTable = reactive({
    data: [] as CoOccurredTaxa[],
    total: 0,
    page: 1,
    limit: 10,
    keywords: '',
    totalData: [] as CoOccurredTaxa[],
    except: false
  })
  const {
    handleSortChange: handleTaxaSortChange,
    changePage: changeTaxaPage,
    searchTable: searchTaxaTable,
    refreshSearch: refreshTaxaSearch
  } = useTableTools<CoOccurredTaxa>(taxa, taxaTable)

  const plotData = ref<any[]>([])
  const plotLayout = reactive({
    height: 300,
    margin: {
      t: 30,
      l: 80,
      b: 50,
      r: 60
    },
    xaxis: {
      title: 'Relative abundance (%)'
    },
    yaxis: {
      title: 'Percent of samples (%)'
    },
    legend: {
      x: 0.5,
      y: 1,
      orientation: 'h'
    }
  })
  const boxplotData = ref<any[]>([])
  const boxplotLayout = reactive({
    height: 300,
    margin: {
      t: 30,
      l: 90,
      b: 50,
      r: 60
    },
    yaxis: {
      title: 'Relative abundance (%)'
    },
    legend: {
      x: 0.5,
      y: 1,
      orientation: 'h'
    }
  })

  getAllMicrobeAbundances(
    disease,
    taxon,
    stats,
    abundances,
    taxa,
    plotData,
    boxplotData,
    searchAbundanceTable,
    searchTaxaTable
  )
  const toggleOutliers = () => {
    const status = boxplotData.value[0].boxpoints
    boxplotData.value.forEach((item) => (item.boxpoints = !status))
  }
  const handleDownloadAbundanceByMeshIDAndTaxonID = async () => {
    const res = await downloadAbundanceByMeshIDAndTaxonID(disease, taxon)
    let contents = '#disease: ' + disease + '\t' + stats.term + '\t' + stats.note + '\n'
    contents += '#total samples: ' + stats.all_samples + '\n'
    contents += '#loaded samples: ' + stats.total_loaded_samples + '\n'
    contents += '#taxon: ' + taxon + '\t' + stats.name + '\t' + stats.node_rank + '\n'
    contents += ['RUNID', 'Data type', 'NCBI taxon ID', 'Relative abundance'].join('\t') + '\n'
    res.forEach((item: any) => {
      const arr = []
      for (const k in item) arr.push(item[k])
      contents += arr.join('\t') + '\n'
    })
    const data = new Blob([contents], {
      type: 'text/plain;charset=utf-8'
    })
    const filename = 'abundances_of_' + taxon + '_in_' + disease + '.txt'
    download(data, filename)
  }
  const handleDownloadAssociatedUniqueRunID = async () => {
    const res = await downloadAssociatedUniqueRunID(disease, taxon)
    let contents = ''
    res.forEach((item: any) => {
      const arr = []
      for (const k in item) arr.push(item[k])
      contents += arr.join('\t') + '\n'
    })
    const data = new Blob([contents], {
      type: 'text/plain;charset=utf-8'
    })
    const filename =
      'unique_run_ids_associated_with_' +
      disease +
      '_in_which_abundances_of_' +
      taxon +
      '_is_available.txt'
    download(data, filename)
  }
  const handleDownloadAbundancesByTaxaAndDiseaseId = async (item: CoOccurredTaxa) => {
    const res = await downloadAbundancesByTaxaAndDiseaseId(disease, item.taxon1, item.taxon2)
    let contents = '#disease: ' + disease.disease + '\t' + disease.term + '\t' + disease.note + '\n'
    contents += '#total samples: ' + disease.all_samples + '\n'
    contents += '#loaded samples: ' + disease.loaded_samples + '\n'
    contents += '#taxon rank level: ' + stats.node_rank + '\n'
    contents += '#taxon 1: ' + stats.ncbi_taxon_id + '\t' + stats.name + '\n'
    contents += '#taxon 2: ' + item.taxon2 + '\t' + item.taxon2_sci_name + '\n'
    contents += ['RUNID', 'Data type', 'NCBI taxon ID', 'Relative abundance'].join('\t') + '\n'
    res.forEach((item: any) => {
      const arr = []
      for (const k in item) arr.push(item[k])
      contents += arr.join('\t') + '\n'
    })
    const data = new Blob([contents], {
      type: 'text/plain;charset=utf-8'
    })
    const filename = 'coocurring_of_' + item.taxon1 + '_' + item.taxon2 + '_in_' + disease + '.txt'
    download(data, filename)
  }
  const handleDownloadAllCoOccurredPairs = () => {
    let contents = '#disease: ' + disease + '\t' + stats.term + '\t' + stats.note + '\n'
    contents += '#total samples: ' + stats.all_samples + '\n'
    contents += '#loaded samples: ' + stats.total_loaded_samples + '\n'
    contents += '#taxon: ' + stats.ncbi_taxon_id + '\t' + stats.node_rank + '\t' + stats.name + '\n'
    contents +=
      [
        'disease',
        'taxonomic rank',
        'taxon',
        'co-occurred taxon',
        'Pearson pvalue',
        'Pearson cor',
        'Spearman pvalue',
        'Spearman cor',
        'Nr. samples co-occurred',
        'Nr. samples taxon only',
        'Nr. samples the other taxon only',
        'Nr. samples neither is in',
        'Odds ratio Fisher test',
        'Fisher pvalue',
        'OR CI1',
        'OR CI2'
      ].join('\t') + '\n'
    taxa.value.forEach((item: any) => {
      const arr = []
      for (const k in item) arr.push(item[k])
      contents += arr.join('\t') + '\n'
    })
    const data = new Blob([contents], {
      type: 'text/plain;charset=utf-8'
    })
    const filename = 'taxa_cooccuring_with_' + stats.ncbi_taxon_id + '_in_' + disease + '.txt'
    download(data, filename)
  }

  const navigateTo = (url: string) => {
    window.open(url)
  }
</script>

<style lang="less" scoped>
  .ass-species-detail-page {
    .info {
      background: #f5f5f5;
      padding: 15px;
      margin-bottom: 20px;
      color: #666;
      list-style-type: disc;

      dd {
        display: list-item;
        margin-inline-start: 3em;
        dd {
          display: list-item;
          margin-inline-start: 3em;
          list-style-type: circle;
        }
      }
    }

    hr {
      margin-top: 23px;
      margin-bottom: 23px;
      border: 0;
      border-top: 1px solid #eeeeee;
    }

    .search-wrapper {
      display: flex;

      .el-input {
        flex: 1;
      }
    }
  }
</style>
