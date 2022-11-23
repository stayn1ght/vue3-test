<template>
  <div class="run-detail-page">
    <h1>
      Run
      <my-link
        is-external
        :to="`https://trace.ncbi.nlm.nih.gov/Traces/index.html?run=${stats.run_id}`"
      >
        {{ stats.run_id }}
      </my-link>
    </h1>
    <h2>Run details</h2>
    <ul>
      <li>
        <span class="font-bold">Run ID</span>:
        <my-link
          is-external
          :to="`https://trace.ncbi.nlm.nih.gov/Traces/index.html?run=${stats.run_id}`"
        >
          {{ stats.run_id }}
        </my-link>
      </li>
      <li>
        <span class="font-bold">Sample information</span>: {{ stats.original_sample_description }}
      </li>
      <li>
        <span class="font-bold">In project</span>:
        <my-link :to="`/data/project/${stats.project_id}`">
          {{ stats.project_id }}
        </my-link>
        <my-link is-external :to="`https://www.ncbi.nlm.nih.gov/bioproject/${stats.project_id}`" />
      </li>
      <li>
        <span class="font-bold">Project information</span>: {{ stats.Original_Project_description }}
      </li>
      <li> <span class="font-bold">Experiment type</span>: {{ stats.experiment_type }} </li>
      <li> <span class="font-bold">Instrument model</span>: {{ stats.instrument_model }} </li>
      <li>
        <span class="font-bold">Nr. sequenced reads</span>:
        <span class="text-red-800 italic font-bold">{{
          stats.nr_reads_sequenced?.toLocaleString()
        }}</span>
      </li>
      <li> <span class="font-bold">Host age</span>: {{ stats.host_age }} </li>
      <li> <span class="font-bold">Gender</span>: {{ stats.sex }} </li>
      <li> <span class="font-bold">BMI</span>: {{ stats.BMI }} </li>
      <li> <span class="font-bold">Geo location</span>: {{ stats.country }} </li>
      <li>
        <dl>
          <dt><span class="font-bold">Phenotype(s)</span>:</dt>
          <template v-if="phenotypes.length">
            <dd v-for="p in phenotypes" :key="p.disease">
              <my-link :to="`/phenotypes/${p.disease}`">{{ p.term }}</my-link>
              <my-link :to="`https://meshb.nlm.nih.gov/record/ui?ui=${p.disease}`" is-external />
            </dd>
          </template>
          <template v-else>na,</template>
        </dl>
      </li>
      <li>
        <span class="font-bold">QC status *</span>:
        <span
          :class="{
            'bg-green-100/30': stats.QCStatus === 1,
            'bg-red-100/30': stats.QCStatus === 0,
            'bg-gray-100/30': stats.QCStatus === null
          }"
        >
          {{ stats.QCStatus }}
          <span v-if="stats.QCStatus === 1">; microbe relative abundance available</span>
          <span v-if="stats.QCStatus === 0">; <code>reason</code>: {{ stats.QCMessage }}</span>
          <span v-if="stats.QCStatus === null">
            (empty); meta data available in our database, however the raw data are to be
            processed</span
          >
        </span>
      </li>
    </ul>
    <div v-show="stats.QCStatus > 0">
      <h2>Relative abundances</h2>
      <p class="font-bold">
        <el-icon style="vertical-align: middle"><Menu /></el-icon> species
      </p>
      <el-row>
        <el-col :span="8">
          <v-plotly :plotly-data="speciesPie" :plotly-layout="speciesPieLayout" />
        </el-col>
        <el-col :span="16">
          <v-plotly :plotly-data="speciesBar" :plotly-layout="barLayout" />
        </el-col>
      </el-row>
      <my-link :show-icon="false" to="" @click="downloadRelativeAbundanceByRunID('species')">
        Download relative species abundance data as tsv
        <el-icon> <Download /> </el-icon>
      </my-link>
      <el-divider border-style="dotted" />
      <p class="font-bold">
        <el-icon style="vertical-align: middle"><Menu /></el-icon> genus
      </p>
      <el-row>
        <el-col :span="8">
          <v-plotly :plotly-data="genusPie" :plotly-layout="genusPieLayout" />
        </el-col>
        <el-col :span="16">
          <v-plotly :plotly-data="genusBar" :plotly-layout="barLayout" />
        </el-col>
      </el-row>
      <my-link :show-icon="false" to="" @click="downloadRelativeAbundanceByRunID('genus')">
        Download relative genus abundance data as tsv
        <el-icon> <Download /> </el-icon>
      </my-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ResPhenotypes, ResRun } from '@api/data/run/types'
  import { getRelativeAbundanceByRunID, getRunDetailsByRunId } from '@api/data/run'
  import { Menu, Download } from '@element-plus/icons-vue'
  import VPlotly from '@/components/VPlotly/index.vue'
  import { download } from '@/utils'

  const router = useRouter()
  const {
    params: { id }
  } = router.currentRoute.value

  const phenotypes = ref<ResPhenotypes[]>([])
  const stats = reactive<ResRun>({})

  const speciesPie = ref<any[]>([])
  const speciesBar = ref<any[]>([])
  const speciesPieLayout = reactive({
    title: 'Relative abundance',
    annotations: [
      {
        font: {
          size: 20
        },
        showarrow: false,
        text: 'Species',
        x: 0.5,
        y: 0.5
      }
    ],
    height: 400,
    width: 400,
    showlegend: false
  })
  const barLayout = reactive({
    title: 'Relative abundance',
    margin: {
      t: 100,
      l: 180,
      b: 50,
      r: 10
    }
  })

  const genusPie = ref<any[]>([])
  const genusBar = ref<any[]>([])
  const genusPieLayout = reactive({
    title: 'Relative abundance',
    annotations: [
      {
        font: {
          size: 20
        },
        showarrow: false,
        text: 'Genus',
        x: 0.5,
        y: 0.5
      }
    ],
    height: 400,
    width: 400,
    showlegend: false
  })

  getRunDetailsByRunId(id, phenotypes, stats, speciesPie, speciesBar, genusPie, genusBar)

  const downloadRelativeAbundanceByRunID = async (taxon_level: string) => {
    const res = await getRelativeAbundanceByRunID({
      loaded_uid: stats.loaded_uid,
      taxon_level
    })

    let contents =
      '#relative abundance information for RUN: ' +
      stats!.run_id +
      ', at ' +
      taxon_level +
      ' level\n'
    for (const key in stats) {
      contents += '#' + key + ': ' + stats[key] + '\n'
    }
    // title / header
    contents += ['ncbi_taxon_id', 'relative_abundance', 'scientific_name'].join('\t') + '\n'
    res.forEach((item: any) => {
      const arr = []
      for (const k in item) arr.push(item[k])
      contents += arr.join('\t') + '\n'
    })
    const data = new Blob([contents], {
      type: 'text/plain;charset=utf-8'
    })
    const filename =
      'relative_abundance_for_RUN_' + stats!.run_id + '_taxonlevel_' + taxon_level + '.txt'
    download(data, filename)
  }
</script>

<style lang="less" scoped>
  .run-detail-page {
    ul {
      list-style: disc;
      dd,
      li {
        display: list-item;
        margin-inline-start: 3em;
        dd {
          list-style: circle;
        }
      }
    }
  }
</style>
