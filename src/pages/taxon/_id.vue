<template>
  <div class="taxon-detail-page">
    <a-anchor class="catalogue" @click="handleAnchorClick" :target-offset="80">
      <a-anchor-link :href="'#' + path + '#Overview'" title="Overview" />
      <a-anchor-link :href="'#' + path + '#associated-phenotypes'" title="Associated phenotypes" />
      <a-anchor-link
        :href="'#' + path + '#relative abundances across phenotypes'"
        title="Relative abundances across phenotypes"
      />
      <a-anchor-link :href="'#' + path + '#marker-taxon'" title="Marker taxon">
        <a-anchor-link :href="'#' + path + '#overview'" title="Overview" />
        <a-anchor-link :href="'#' + path + '#table-view'" title="Table view" />
        <a-anchor-link :href="'#' + path + '#barplot-view'" title="Barplot view" />
      </a-anchor-link>
    </a-anchor>
    <div class="content">
      <h1>
        Species:&nbsp;
        <my-link
          class="italic"
          is-external
          :to="`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=${id}`"
          >{{ taxon.name }}</my-link
        >&nbsp;
        <a :href="'#' + path + '#marker-taxon'"><i class="iconfont icon-star"></i></a>
      </h1>
      <h2 class="title" :id="`${path}#Overview`">Overview</h2>
      <p>
        In our database, species:
        <my-link
          is-external
          :to="`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=${id}`"
          >Bacteroides uniformis</my-link
        >
        is found in
        <span class="text-red-800 italic font-bold">{{
          markerStats.total_presented_samples?.toLocaleString()
        }}</span>
        runs, belonging to
        <span class="text-red-800 italic font-bold">{{
          markerStats.total_phenotypes?.toLocaleString()
        }}</span>
        phenotype(s). In total there are
        <span class="text-red-800 italic font-bold">{{
          markerStats.total_loaded_samples?.toLocaleString()
        }}</span>
        valid runs belonging to these phenoptye(s).
      </p>
      <dl>
        <dt>Link to external databases:</dt>
        <dd
          ><my-link
            is-external
            :to="`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=${id}`"
            >NCBI taxonomy</my-link
          ></dd
        >
        <dd
          ><my-link is-external :to="`https://www.ebi.ac.uk/ena/browser/view/Taxon:${id}`"
            >ENA taxonomy</my-link
          ></dd
        >
      </dl>
      <h2 class="title mt-50px" :id="`${path}#associated-phenotypes`">Associated phenotypes</h2>
      <base-table
        class="mb-10px"
        @pagination-change="phenotypeChangePage"
        :table-data="phenotypeTable.data"
        :table-head="phenotypeTableHead"
        :total="phenotypeTable.total"
        :default-sort="{ prop: 'samples', order: 'descending' }"
        @sort-change="phenotypeHandleSortChange"
      >
        <template #phenotype="{ row }">
          <my-link :to="`/phenotype/${row.disease}`">{{ row.term }}</my-link>
          <my-link :to="`https://meshb.nlm.nih.gov/record/ui?ui=${row.disease}`" is-external />
        </template>
        <template #runs="{ row }">
          {{ row.samples?.toLocaleString() }} ({{ row.pct_samples?.toFixed(3) }}% out of
          {{ row.valid_runs?.toLocaleString() }} valid runs)
        </template>
        <template #abundance="{ row }">
          {{ row.abus_median?.toFixed(5) }}, {{ row.abus_mean?.toFixed(5) }},
          {{ row.abus_sd?.toFixed(5) }}
        </template>
      </base-table>
      <my-link :show-icon="false" to="" @click="getPhenotypeTable"
        >Download statistics in the above table as tsv <el-icon> <Download /> </el-icon
      ></my-link>
      <h3 class="title">Taxon prevalence in associated phenotypes</h3>
      <v-plotly :plotly-data="phenotypeBarPlotData" :plotly-layout="phenotypeBarPlotLayout" />
      <div class="wrapper" v-if="phenotypeBarPlotData.length">
        <el-button size="small" color="#9c27b0" @click="replotPrevalenceBar">
          SHOW PHENOTYPES WITH >= VALID RUNS
        </el-button>
        <el-input
          size="small"
          placeholder="default is 50"
          v-model="thresholdValidRuns"
          @keyup.enter="replotPrevalenceBar"
        />
      </div>
      <dl class="info mt-5px">
        <dt>
          <el-icon><InfoFilled /></el-icon>Note:
        </dt>
        <dd>
          By default, only phenotypes with
          <span class="text-red-500 bg-red-100/30">more than 50 valid runs</span>
          will be included in this barplot.
        </dd>
        <dd>Users may increase/decrease this threshold using widgets above.</dd>
        <dd>
          Here prevalence is defined as percentage of
          <span class="text-red-500 bg-red-100/30">
            runs in which current taxon is present (w/ relative abundance >= 0.01%)</span
          >
          out of <span class="text-red-500 bg-red-100/30">valid runs</span>.
        </dd>
      </dl>
      <h2 class="title" :id="`${path}#relative abundances across phenotypes`">
        Relative abundances across phenotypes
      </h2>
      <h3 class="title">
        Distribution of relative abundances of current taxon across all valid runs
      </h3>
      <v-plotly :plotly-data="plotData" :plotly-layout="plotDataLayout" />
      <el-button
        class="mt-20px"
        size="small"
        v-if="plotData.length"
        color="#9c27b0"
        @click="toggleOutliers"
      >
        <el-icon> <Setting /> </el-icon>&nbsp;<span class="font-bold">Hide/show outliers</span>
      </el-button>
      <dl class="info mt-5px">
        <dt>
          <el-icon><InfoFilled /></el-icon>Note:
        </dt>
        <dd>
          Here only phenotypes with
          <span class="text-red-500 bg-red-100/30">more than 50 valid runs</span> will be shown.
        </dd>
        <dd>
          This plot (if available) shows the distribution of relative abundances of current taxon,
          i.e. the percentage of runs out of all valid runs (Y-axis) within certain ranges of
          relative abundances. All shown in the tooltips includes cumulative percentages (cumsum
          pct) indicating the total percentage of runs in which current taxon with relative
          abundances less than or equal to the threshold (x-axis).
        </dd>
      </dl>
      <h3 class="title"> Boxplot of relative abundances of current taxon across all valid runs </h3>
      <v-plotly :plotly-data="boxPlotData" :plotly-layout="boxPlotLayout" />
      <dl class="info mt-5px">
        <dt>
          <el-icon><InfoFilled /></el-icon>Note:
        </dt>
        <dd>
          Here only phenotypes with
          <span class="text-red-500 bg-red-100/30">more than 50 valid runs</span> will be shown.
        </dd>
        <dd> Only runs with non-zero relative abundance values are included in the boxplot. </dd>
      </dl>
      <h2 class="title" :id="`${path}#marker-taxon`">Marker taxon</h2>
      <h3 class="title" :id="`${path}#overview`">Overview</h3>
      <dl>
        <dt class="font-normal">
          In <logo class="font-bold" />, species:
          <my-link
            is-external
            :to="`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=${id}`"
          >
            <span class="italic">Bacteroides uniformis</span>
          </my-link>
          is a <span class="font-bold">marker taxon</span> in
        </dt>
        <dd>
          <span class="text-red-800 italic font-bold">{{ markerStats.entries }}</span>
          comparison(s), in
        </dd>
        <dd>
          <span class="text-red-800 italic font-bold">{{ markerStats.projects }}</span>
          project(s), related to
        </dd>
        <dd>
          <span class="text-red-800 italic font-bold">{{ markerStats.phenotypes }}</span>
          unique phenotype comparison(s).
        </dd>
      </dl>
      <p>
        "<span class="font-bold">Marker taxa</span>" refer to taxa (at species and genus levels)
        that show sigificant differences in relative abundances between phenotypes, and were
        identified using
        <my-link
          is-external
          to="https://huttenhower.sph.harvard.edu/lefse/#:~:text=LEfSe%20(Linear%20discriminant%20analysis%20Effect,encoding%20biological%20consistency%20and%20effect"
          >LEfSe (Linear discriminant analysis Effect Size) analysis</my-link
        >
      </p>
      <h3 class="title" :id="`${path}#table-view`">Table view</h3>
      <base-table
        class="mb-10px"
        @pagination-change="speciesChangePage"
        :table-data="speciesTable.data"
        :table-head="speciesTableHead"
        :total="speciesTable.total"
        :default-sort="{ prop: 'phenotype1_term', order: 'ascending' }"
        @sort-change="speciesHandleSortChange"
        :cell-class-name="setPhenotypeCls"
      >
        <template #projectId="{ row }">
          <my-link :to="`/data/project/${row['project_id']}`">{{ row.project_id }}</my-link>
        </template>
        <template #phenotype1="{ row }">
          <my-link :to="`/phenotypes/${row['phenotype1']}`">
            {{ row['phenotype1_term'] }}
            <span v-if="row.LDA < 0"> : {{ row.LDA?.toFixed(3) }}</span>
          </my-link>
          <el-tooltip
            content="view details of this disease at NCBI MeSH website in a new window/tab"
            effect="dark"
            placement="top"
          >
            <el-button
              type="primary"
              size="small"
              style="float: right"
              @click="navigateTo(row['phenotype1'])"
            >
              link to: MeSH db&nbsp;
              <el-icon><Share /></el-icon>
            </el-button>
          </el-tooltip>
        </template>
        <template #phenotype2="{ row }">
          <my-link :to="`/phenotypes/${row['phenotype2']}`">
            {{ row['phenotype2_term'] }}
            <span v-if="row.LDA > 0"> : {{ row.LDA?.toFixed(3) }}</span>
          </my-link>
          <el-tooltip
            content="view details of this disease at NCBI MeSH website in a new window/tab"
            effect="dark"
            placement="top"
          >
            <el-button
              type="primary"
              size="small"
              style="float: right"
              @click="navigateTo(row['phenotype2'])"
            >
              link to: MeSH db&nbsp;
              <el-icon><Share /></el-icon>
            </el-button>
          </el-tooltip>
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
      <h3 class="title" :id="`${path}#barplot-view`">Barplot view</h3>
      <div :class="baseLayer ? 'svg-plot' : ''" ref="svgPlot"></div>
      <div style="text-align: right" v-if="baseLayer">
        <el-button size="small" color="#9c27b0" @click="downloadPng"> SAVE AS PNG </el-button>
        <el-button class="ml-3px" size="small" color="#9c27b0" @click="downloadSvg">
          SAVE AS SVG
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import 'ant-design-vue/dist/antd.css'
  import { Download, InfoFilled, Setting, Share } from '@element-plus/icons-vue'
  import {
    Details_of_a_marker_species,
    Marker_stats,
    Phenotypes_associated_with_taxon,
    Taxon
  } from '@api/species/detail/type'
  import { getAllSpecies } from '@api/species/detail'
  import { useTableTools } from '@/hooks/table'
  import { download, getSVGString, svgString2Image } from '@/utils'
  import { doPlot } from '@utils/d3/visMarkerSpecies'

  const handleAnchorClick = (e: Event) => {
    e.preventDefault()
  }

  const router = useRouter()
  const {
    path,
    params: { id }
  } = router.currentRoute.value
  const taxon = reactive<Taxon>({})
  const markerStats = reactive<Marker_stats>({})
  const phenotypes = ref<Phenotypes_associated_with_taxon[]>([])
  const phenotypeTableHead = [
    {
      label: 'Phenotype',
      slotName: 'phenotype',
      sortOrders: ['descending', 'ascending'],
      prop: 'term',
      width: '200'
    },
    {
      label: 'Found in nr. of runs of the respective phenotype (out of total %)',
      slotName: 'runs',
      sortOrders: ['descending', 'ascending'],
      prop: 'samples'
    },
    {
      label: 'Abundance statistics, median, mean, SD',
      slotName: 'abundance',
      sortable: false
    }
  ]
  const phenotypeTable = reactive({
    data: [] as Phenotypes_associated_with_taxon[],
    total: 0,
    page: 1,
    limit: 10,
    keywords: '',
    totalData: [] as Phenotypes_associated_with_taxon[],
    except: false
  })
  const orderedPhenotypes = ref<Phenotypes_associated_with_taxon[]>([])
  const {
    searchTable: phenotypeSearchTable,
    changePage: phenotypeChangePage,
    handleSortChange: phenotypeHandleSortChange
  } = useTableTools<Phenotypes_associated_with_taxon>(phenotypes, phenotypeTable)
  const getPhenotypeTable = (e: Event) => {
    e.preventDefault()
    let contents = '#statistics on phenotypes in which the current taxon is found: \n'
    contents += '#please consult our database: gmrepo.humangut.info for details.\n'
    contents += '#ncbi taxon id: ' + taxon.ncbi_taxon_id + '\n'
    contents += '#taxon rank: : ' + taxon.node_rank + '\n'
    contents += '#scientific name: ' + taxon.name + '\n'
    contents +=
      [
        'phenotype',
        'nr. runs in which current species is found',
        'nr. total valid runs of current phenotype',
        'abundance mean',
        'abundance median',
        'abundance sd',
        'phenotype term',
        'phenotype description'
      ].join('\t') + '\n'
    phenotypes.value.forEach((row: Phenotypes_associated_with_taxon) => {
      contents +=
        [
          row.disease,
          row.samples,
          row.valid_runs,
          row.abus_mean,
          row.abus_median,
          row.abus_sd,
          row.term,
          row.note
        ].join('\t') + '\n'
    })
    const data = new Blob([contents], {
      type: 'text/plain;charset=utf-8'
    })
    const filename = 'phenotype_associated_with_' + taxon.ncbi_taxon_id + '.txt'
    download(data, filename)
  }

  const phenotypeBarPlotData = ref<any[]>([])
  const phenotypeBarPlotLayout = reactive({
    height: 100,
    margin: {
      t: 30,
      l: 380,
      b: 50,
      r: 120
    },
    xaxis: {
      title: 'Percent of samples (%)'
    }
  })
  const thresholdValidRuns = ref<number>()
  const replotPrevalenceBar = () => {
    const newValue = thresholdValidRuns.value
    if (newValue) {
      const barplot_x = []
      const barplot_y = []
      const barplot_text = []

      for (let pheno_idx = 0; pheno_idx < orderedPhenotypes.value.length; pheno_idx++) {
        let pheno_row = orderedPhenotypes.value[pheno_idx]
        let term = pheno_row.term

        if (pheno_row.valid_runs >= newValue) {
          let pct = Math.round((pheno_row.pct_samples + Number.EPSILON) * 10) / 10
          barplot_x.push(pct)
          barplot_y.push(term)
          barplot_text.push(pct + '% (' + pheno_row.samples + '/' + pheno_row.valid_runs + ')')
        }
      }

      let trace = {
        type: 'bar',
        x: barplot_x,
        y: barplot_y,
        text: barplot_text,
        textposition: 'outside',
        cliponaxis: false,
        orientation: 'h',
        marker: {
          width: 0.5,
          color: [] as string[]
        }
      }

      trace.marker.color = trace.y.map(function (y) {
        return y == 'Health' ? 'lightgreen' : '#2196f3'
      })

      phenotypeBarPlotData.value = [trace]
      phenotypeBarPlotLayout.height = 100 + barplot_x.length * 16
    }
  }

  const plotData = ref<any[]>([])
  const plotDataLayout = reactive({
    height: 350,
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
      x: 1,
      y: 1,
      orientation: 'v'
    }
  })

  const boxPlotData = ref<any[]>([])
  const boxPlotLayout = reactive({
    height: 100,
    margin: {
      t: 30,
      l: 380,
      b: 50,
      r: 60
    },
    yaxis: {
      title: 'Relative abundance (%)'
    },
    showlegend: false
  })
  const toggleOutliers = () => {
    for (let i = 0; i < boxPlotData.value.length; i++) {
      boxPlotData.value[i].boxpoints = !boxPlotData.value[i].boxpoints
    }
  }

  const species = ref<Details_of_a_marker_species[]>([])
  const speciesTableHead = [
    { label: 'ProjectID', prop: 'project_id', slotName: 'projectId', width: '150' },
    { label: 'Data type', prop: 'experiment_type', width: '120' },
    { label: 'Phenotype1', slotName: 'phenotype1', prop: 'phenotype1_term' },
    { label: 'Phenotype2', slotName: 'phenotype2', prop: 'phenotype2_term' },
    { slotName: 'operation', sortable: false, width: '50' }
  ]
  const speciesTable = reactive({
    data: [] as Details_of_a_marker_species[],
    total: 0,
    page: 1,
    limit: 10,
    keywords: '',
    totalData: [] as Details_of_a_marker_species[],
    except: false
  })
  const {
    searchTable: speciesSearchTable,
    changePage: speciesChangePage,
    handleSortChange: speciesHandleSortChange
  } = useTableTools<Details_of_a_marker_species>(species, speciesTable)

  const d3Data = reactive({
    datatype: 'species-centric-view',
    data: {}
  })

  getAllSpecies(
    id,
    taxon,
    markerStats,
    phenotypes,
    orderedPhenotypes,
    phenotypeBarPlotData,
    phenotypeBarPlotLayout,
    plotData,
    plotDataLayout,
    boxPlotData,
    boxPlotLayout,
    species,
    d3Data,
    phenotypeSearchTable,
    speciesSearchTable
  )
  const setPhenotypeCls = ({ row, columnIndex }: any) => {
    if (columnIndex === 2) {
      if (row.LDA < 0) return 'bg-blue-100'
    }
    if (columnIndex === 3) {
      if (row.LDA > 0) return 'bg-pink-100'
    }
    return ''
  }

  const svgPlot = ref()
  const baseLayer = ref()
  watch(d3Data, () => {
    baseLayer.value = doPlot(d3Data, svgPlot.value)
  })
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

  const navigateTo = (disease: string) => {
    window.open('https://meshb.nlm.nih.gov/record/ui?ui=' + disease)
  }
</script>

<style lang="less" scoped>
  .taxon-detail-page {
    /deep/ .ant-anchor-link-title {
      white-space: normal;
    }
    .title {
      margin-top: 40px;
      font-weight: 400;
    }
    dd {
      display: list-item;
      margin-inline-start: 3em;
    }
    .catalogue {
      position: fixed;
      width: 200px;
      top: 80px;
    }
    .content {
      padding-left: 220px;
    }
    .wrapper {
      display: flex;
      margin-top: 20px;
      align-items: center;
      .el-input {
        margin-left: 5px;
        width: 200px;
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

    .svg-plot {
      border: 1px solid #ccc;
      border-radius: 2px;
    }
  }
</style>
