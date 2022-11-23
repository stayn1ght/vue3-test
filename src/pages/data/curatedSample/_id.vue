<template>
  <div class="curated-sample-page">
    <h1>Curated sample: {{ id }}</h1>
    <h2>Sample details</h2>
    <ul>
      <li>
        <dl>
          <dt>
            <span class="font-bold">Sample information</span>: this is a curated sample, it is
            associated with
            <span class="text-red-800 italic font-bold">{{ runIds.length }}</span>
            run(s):
          </dt>
          <dd v-for="run in runIds" :key="run.run_id">
            <my-link :to="`/data/run/${run.run_id}`">{{ run.run_id }}</my-link>
            <my-link
              is-external
              :to="`https://trace.ncbi.nlm.nih.gov/Traces/index.html?run=${run.run_id}`"
            />
          </dd>
        </dl>
        In cases where one sample corresponded to multiple runs (i.e. a sample was sequenced
        multiple times), the raw seqeunce files were combined before taxonomic analysis. In cases
        where multiple types of sequences (e.g. 16S and mNGS data), often only the mNGS data were
        used.
      </li>
      <li>
        <span class="font-bold">Phenotype</span>:
        <my-link :to="`/phenotypes/${stats.phenotype}`">{{ stats.phenotype }}</my-link>
        <my-link is-external :to="`https://meshb.nlm.nih.gov/record/ui?ui=${stats.phenotype}`" />
      </li>
      <li>
        <span class="font-bold">In project</span>:
        <my-link :to="`/data/project/${stats.project_id}`">{{ stats.project_id }}</my-link>
        <my-link is-external :to="`https://www.ncbi.nlm.nih.gov/bioproject/${stats.project_id}`" />
      </li>
      <li>
        <span class="font-bold">Project information</span>: {{ stats.Original_Project_description }}
      </li>
    </ul>
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
    <my-link
      :show-icon="false"
      to=""
      @click="downloadRelativeAbundanceBySampleUID('species')"
    >
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
    <my-link
      :show-icon="false"
      to=""
      @click="downloadRelativeAbundanceBySampleUID('genus')"
    >
      Download relative genus abundance data as tsv
      <el-icon> <Download /> </el-icon>
    </my-link>
  </div>
</template>

<script setup lang="ts">
  import { Menu, Download } from '@element-plus/icons-vue'
  import { ResAssociated_run_ids, ResSample_info } from '@api/data/curatedSample/types'
  import {
    getCuratedSampleDetailsBySampleId,
    getRelativeAbundanceByCuratedSampleUID
  } from '@api/data/curatedSample'
  import { download } from '@/utils'

  const router = useRouter()
  const {
    params: { id }
  } = router.currentRoute.value

  const runIds = ref<ResAssociated_run_ids[]>([])
  const stats = reactive<ResSample_info>({})

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

  getCuratedSampleDetailsBySampleId(id, runIds, stats, speciesPie, speciesBar, genusPie, genusBar)

  const downloadRelativeAbundanceBySampleUID = async (taxon_level: string) => {
    const res = await getRelativeAbundanceByCuratedSampleUID({ taxon_level, sample_uid: id })
    let contents =
      '#relative abundance information for curated sample: ' +
      id +
      ', at ' +
      taxon_level +
      ' level\n'
    contents += '#for project: ' + stats.project_id + '\n'
    contents += '#phenotype: ' + stats.phenotype + ', ' + stats.term + '\n'

    // title / header
    contents +=
      ['ncbi_taxon_id', 'relative_abundance', 'taxon_rank_level', 'scientific_name'].join('\t') +
      '\n'
    res.forEach((item: any) => {
      const arr = []
      for (const k in item) arr.push(item[k])
      contents += arr.join('\t') + '\n'
    })
    const data = new Blob([contents], {
      type: 'text/plain;charset=utf-8'
    })
    const filename =
      'relative_abundance_for_curated_sample_' + id + '_at_taxonlevel_' + taxon_level + '.txt'
    download(data, filename)
  }
</script>

<style scoped lang="less">
  .curated-sample-page {
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
