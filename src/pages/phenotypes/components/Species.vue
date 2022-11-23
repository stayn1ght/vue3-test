<template>
  <div class="associated-species">
    <div>
      <p>
        In total
        <span class="text-red-800 font-bold italic">{{ total.toLocaleString() }}</span> species were
        found in samples of this phenotype collected in our database.
        <my-link
          :to="`https://gmrepo.humangut.info/Downloads/SpeciesAndGeneraAssociatedWithPhenotypeID/species_associated_with_${id}.tsv.gz`"
          is-external
          :show-icon="false"
          >Download stats on all species as tsv
          <el-icon style="vertical-align: text-bottom"> <Download /> </el-icon>.
        </my-link>
      </p>
      <dl>
        <dt>
          Shown below are
          <span class="text-red-800 font-bold italic">{{ species.length.toLocaleString() }}</span>
          species presented
        </dt>
        <dd>in >=2 samples</dd>
        <dd>with median relative abundances >=0.01%</dd>
      </dl>
    </div>
    <div class="search-wrapper mt-20px">
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
      :default-sort="{ prop: 'samples', order: 'descending' }"
      @sort-change="handleSortChange"
    >
      <template #species="{ row }">
        <my-link :to="`/phenotypes/${id}/${row['ncbi_taxon_id']}`">{{
          row['scientific_name']
        }}</my-link
        >&nbsp;
        <my-link :to="`/taxon/${row['ncbi_taxon_id']}`" :show-icon="false"
          ><i class="iconfont icon-right"></i
        ></my-link>
        <div style="float: right">
          <el-tooltip
            content="view details of this disease at NCBI MeSH website in a new window/tab"
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
            content="view details of this disease at NCBI MeSH website in a new window/tab"
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
      <template #samples="{ row }">
        {{ row['samples'].toLocaleString() }} ({{ row['pct_of_loaded_samples'].toFixed(3) }}%)
      </template>
      <template #abus="{ row }">
        {{ row.abus_mean.toFixed(5) }}, {{ row.abus_median.toFixed(5) }},
        {{ row.abus_sd.toFixed(5) }}
      </template>
    </base-table>
    <h2>Prevalence vs. abundance</h2>
    <v-plotly :plotly-data="plotlyData" />
    <dl class="info">
      <dt
        ><el-icon><InfoFilled /></el-icon> The plot:</dt
      >
      <dd
        ><span class="font-bold">Prevalence</span>: proportion of samples in which a species/genus
        is found above certain abundance threshold (e.g. 0.01%).</dd
      >
      <dd
        ><span class="font-bold">Abundance</span>: mean/median relative abundance of a species in
        all samples of a phenotype.</dd
      >
    </dl>
    <h2>Species co-occurrences</h2>
    <el-select
      size="large"
      @change="handleSpeciesChange"
      v-model="selected"
      placeholder="Find node by name ..."
      style="width: 100%"
    >
      <el-option v-for="item in selectorData" :key="item" :label="item" :value="item" />
    </el-select>
    <div :class="baseLayer ? 'svg-plot' : ''" ref="svgPlot"></div>
    <div style="text-align: right" v-if="baseLayer">
      <el-button size="small" color="#9c27b0" @click="downloadPng"> SAVE AS PNG </el-button>
      <el-button class="ml-3px" size="small" color="#9c27b0" @click="downloadSvg">
        SAVE AS SVG
      </el-button>
    </div>
    <p>
      Note:
      <span class="bg-red-100/30 text-red-800">
        only part of the network (the first {{ num }} co-occurring pairs) is shown here due to too
        many co-occurring pairs are there ({{ pairTotal?.toLocaleString() }}).
      </span>
    </p>
    <my-link
      :show-icon="false"
      :to="`https://gmrepo.humangut.info/Downloads/CoocurrenceByPhenotypeID/species_cooccurrence_in_${id}.tsv.gz`"
      is-external
    >
      Download all species co-occurrences for this phenotype ({{ id }} - {{ term }})
      <el-icon> <Download /> </el-icon>
    </my-link>
    <div class="info">
      <dl>
        <dt>
          <el-icon><InfoFilled /></el-icon>
          <span class="font-bold">The network</span>:
        </dt>
        <dd>
          <span class="font-bold">nodes</span>: species or genera co-occurred with others in samples
          of this phenotype; the sizes are proportional to the number of connected nodes in the
          network.
        </dd>
        <dd>
          <span class="font-bold">links</span>: indicate co-occur relationships between species or
          genera; the widths are proportional to the absolute value of the correlation coefficient (
          <span class="bg-red-100/30 text-red-800"> Pearson correlation </span>
          ), while the colors indicate positive (
          <span class="font-bold text-green-800">green</span>
          ) or negative (
          <span class="font-bold text-red-800">red</span>
          ) correlations.
        </dd>
      </dl>
      <dl>
        <dt>
          <el-icon><InfoFilled /></el-icon>
          <span class="font-bold">Co-occurred taxon pairs</span>:
        </dt>
        Two taxa (i.e., either two species or genera) will be considered as **co-occurred** in the
        disease (
        <span class="bg-red-100/30 text-red-800">Crohn Disease</span>
        ) associated samples if they meet **all** the following criteria:
        <dd>
          a
          <span class="bg-red-100/30 text-red-800">Fisher's exact test</span>
          was used to calculate the odds of the two taxa to co-occur in the disease associated
          samples/run based on their **presence**/**absence** information. A taxon was considered as
          **present** in a sample/run if its relative abundance was higher than 0.01%. A p-value and
          odds ratio (OR) were reported for each pair. The pair with p-value &lt; 0.05 was selected.
          The
          <span class="bg-red-100/30 text-red-800">phyper()</span>
          function implemented in **R** was used.
        </dd>
        <dd>
          <span class="bg-red-100/30 text-red-800">Peasrson</span>
          correlation analysis was applied to the relative abundances of the two taxa in the disease
          associated samples. The pair with a p value &lt; 0.05 was selected.
        </dd>
        <dd>
          <span class="bg-red-100/30 text-red-800">Spearman</span>
          correlation analysis was applied to the relative abundances of the two taxa in the disease
          associated samples. The pair with a p value &lt; 0.05 was selected.
        </dd>
      </dl>
      <dl>
        <dt>
          <el-icon><InfoFilled /></el-icon>
          <span class="font-bold">Usage</span>:
        </dt>
        <dd>
          <span class="bg-red-100/30 text-red-800">mouse over a node</span>
          to a) highlight the node and its direct neighbors, and b) show the names of the node and
          its direct neighbors;
        </dd>
        <dd>
          <span class="bg-red-100/30 text-red-800">click a node</span>
          to highlight it and its direct neighbors
        </dd>
        <dd>
          <span class="bg-red-100/30 text-red-800">click a node and move it around</span>
          to fade other nodes and edges;
        </dd>
        <dd>
          <span class="bg-red-100/30 text-red-800">click the text label</span>
          of a node to show the association details in a new window
        </dd>
        <dd>
          <span class="bg-red-100/30 text-red-800">double-click a node</span>
          to move it to the canvas center;
        </dd>
        <dd>
          <span class="bg-red-100/30 text-red-800">double-click the canvas</span>
          to zoom in;
        </dd>
        <dd>
          <span class="bg-red-100/30 text-red-800">use mouse wheel</span>
          to zoom in and out of the whole plot
        </dd>
        <dd>
          <span class="bg-red-100/30 text-red-800">use the selector</span>
          on the top of the plot to find a node of interest and move it to the view center.
        </dd>
      </dl>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { associated_speciesItem, networkdata_d3_speciesItem } from '@api/phenotypes/detail/types'
  import { Download, Refresh, Search, Share, InfoFilled } from '@element-plus/icons-vue'
  import { useTableTools } from '@/hooks/table'
  import VPlotly from '@/components/VPlotly/index.vue'
  import { doPlot } from '@utils/d3/networkSvg'
  import { download, getSVGString, svgString2Image } from '@/utils'

  const props = defineProps<{
    data: associated_speciesItem[]
    total: number
    id: string
    d3Data: networkdata_d3_speciesItem
    term: any
    pairTotal: any
    num: any
  }>()

  const species = ref<associated_speciesItem[]>([])
  const tableHead = [
    { label: 'Species', slotName: 'species', prop: 'scientific_name' },
    {
      label: 'Found in Nr. of samples (%)',
      slotName: 'samples',
      prop: 'samples',
      sortable: 'custom',
      sortOrders: ['descending', 'ascending'],
      width: '250'
    },
    {
      label: 'Relative abundance (mean, median, SD)',
      prop: 'abus_mean',
      sortable: 'custom',
      slotName: 'abus',
      sortOrders: ['descending', 'ascending'],
      width: '350'
    }
  ]
  const table = reactive({
    data: [] as associated_speciesItem[],
    total: 0,
    page: 1,
    limit: 10,
    keywords: '',
    totalData: [] as associated_speciesItem[],
    except: false
  })
  const { handleSortChange, searchTable, refreshSearch, changePage } =
    useTableTools<associated_speciesItem>(species, table)
  watch(
    () => props.data,
    (val) => {
      species.value = val
      searchTable()
    }
  )
  const navigateTo = (url: string) => {
    window.open(url)
  }

  const plotlyData = ref<any[]>([])
  watch(
    () => table.totalData,
    (val: associated_speciesItem[]) => {
      const trace1 = {
        x: [] as number[],
        y: [] as number[],
        mode: 'markers',
        type: 'scatter',
        name: 'median'
      }
      const trace2 = {
        x: [] as number[],
        y: [] as number[],
        mode: 'markers',
        type: 'scatter',
        name: 'mean'
      }
      val.forEach((item: associated_speciesItem) => {
        trace1.x.push(item.pct_of_loaded_samples)
        trace1.y.push(item.abus_median)

        trace2.x.push(item.pct_of_loaded_samples)
        trace2.y.push(item.abus_mean)
      })
      plotlyData.value = [trace1, trace2]
      nextTick(() => {})
    }
  )

  const svgPlot = ref()
  const baseLayer = ref()
  const selected = ref('')
  const selectorData = ref<string[]>([])
  let selectChangeCallback: (val: string) => void
  const handleSpeciesChange = (val: string) => {
    selectChangeCallback(val)
  }
  watch(
    () => props.d3Data.max_n,
    () => {
      const { svg, cb } = doPlot(props.d3Data, svgPlot.value, selectorData)
      baseLayer.value = svg
      selectChangeCallback = cb
    }
  )
  const downloadPng = () => {
    const save = (blob: any) => {
      download(
        blob,
        props.d3Data.disease + '_network_of_co_occurring_' + props.d3Data.level + '.png'
      )
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
      props.d3Data.disease + '_network_of_co_occurring_' + props.d3Data.level + '.svg'
    )
  }
</script>

<style scoped lang="less">
  dd {
    display: list-item;
    margin-inline-start: 3em;
  }
  .info {
    background: #f5f5f5;
    padding: 25px;
    margin-top: 20px;
  }
  .search-wrapper {
    display: flex;
    .el-input {
      flex: 1;
    }
  }
  .svg-plot {
    border: 1px solid #ccc;
    border-radius: 2px;
    border-top: 0;
  }
</style>
